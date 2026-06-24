import { GoogleGenAI, Type, Schema } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const DECOMPOSE_SYSTEM_PROMPT = `You are the planning module of Momentum, a productivity agent that helps people 
actually start and finish tasks before deadlines — not just remind them.

Given a task title, optional extra context, and a deadline, you must:
1. Classify the task into a category (assignment, bill, interview, meeting, custom).
2. Break it into 3-7 ordered sub-steps that are concrete and actionable (never 
   vague like "work on it" — always something a person could start doing in 
   the next 10 minutes).
3. Assign each sub-step a sub-deadline between now and the final deadline, 
   weighted by realistic effort, leaving buffer before the final deadline 
   (never schedule the last sub-step exactly at the deadline).
4. Estimate total effort in minutes.
5. Generate ONE starter artifact for the first sub-step only — something 
   genuinely useful to look at immediately (an outline, a checklist, a short 
   info summary, or a short list of likely questions), so the user has 
   zero-friction content to react to rather than a blank page.

Be specific to the task's actual content. Do not output generic filler.`;

export const DECOMPOSE_RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    category: { type: Type.STRING, enum: ["assignment", "bill", "interview", "meeting", "custom"] },
    effortEstimateMins: { type: Type.NUMBER },
    subSteps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          subDeadline: { type: Type.STRING, format: "date-time" } as any, // Cast to any to handle format if not in Type enum
          estimateMins: { type: Type.NUMBER }
        },
        required: ["title", "subDeadline", "estimateMins"]
      }
    },
    starterArtifact: {
      type: Type.OBJECT,
      properties: {
        type: { type: Type.STRING, enum: ["outline", "checklist", "info_summary", "question_list", "template"] },
        title: { type: Type.STRING },
        content: { type: Type.STRING }
      },
      required: ["type", "title", "content"]
    }
  },
  required: ["category", "effortEstimateMins", "subSteps", "starterArtifact"]
};

export const decomposeTask = async (title: string, rawInput: string, deadline: string, currentTimeISO: string) => {
  const prompt = `Task Title: ${title}\nExtra Context: ${rawInput}\nDeadline: ${deadline}\nCurrent Date/Time: ${currentTimeISO}`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      systemInstruction: DECOMPOSE_SYSTEM_PROMPT,
      responseMimeType: 'application/json',
      responseSchema: DECOMPOSE_RESPONSE_SCHEMA,
      temperature: 0.2,
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from Gemini");
  return JSON.parse(text);
};

export const RISK_ASSESS_SYSTEM_PROMPT = `
You are the Risk Assessment core of Momentum, an AI productivity agent. 
Your sole job is to evaluate a task's execution risk based on behavioral 
and temporal signals — not just the clock.

You will receive a JSON object with these fields:
- task_title: string
- total_effort_hours: number (estimated total effort)
- time_left_hours: number (hours until final deadline)
- substeps_total: number
- substeps_completed: number
- hours_since_last_touched: number
- user_velocity_profile: "fast_starter" | "steady" | "procrastinator" | "unknown"

RISK STATE DEFINITIONS — apply these strictly:
- "calm": Task is on track. Completion rate aligns with time remaining. No behavioral red flags.
- "watch": Mild concern. Either slightly behind pace OR the user hasn't touched 
  it in a while, but there's still comfortable buffer.
- "at_risk": Meaningful gap between progress and time left, OR a procrastinator 
  profile with low touch frequency and tightening deadline.
- "critical": Task will almost certainly be missed without immediate intervention. 
  Trigger this ONLY when evidence is strong across multiple signals (low completion %, 
  very little time left, AND long inactivity).

ANTI-ESCALATION RULES — these are hard constraints:
1. Do NOT escalate to "critical" if time_left_hours > 2x the remaining estimated effort.
2. Do NOT escalate to "at_risk" or higher solely because hours_since_last_touched 
   is high, if the completion rate is healthy.
3. "watch" is the default for mild single-signal concerns. Reserve "at_risk" and 
   "critical" for multi-signal failures.
4. A "fast_starter" who is 50%+ done should never be "critical" unless 
   time_left_hours < 1.5x remaining effort.

Always provide a concise reasoning string (1-2 sentences) explaining your state decision.
Set suggest_replan to true ONLY for "critical" state. Never for "calm" or "watch". 
Use judgment for "at_risk".
`;

export const RISK_ASSESS_RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    risk_state: {
      type: Type.STRING,
      enum: ["calm", "watch", "at_risk", "critical"],
      description: "The evaluated risk level of the task.",
      nullable: false,
    },
    reasoning: {
      type: Type.STRING,
      description: "1-2 sentence explanation of why this risk state was assigned.",
      nullable: false,
    },
    suggest_replan: {
      type: Type.BOOLEAN,
      description: "Whether to trigger cascadeReplan. True only for critical, and optionally for at_risk.",
      nullable: false,
    },
    confidence: {
      type: Type.STRING,
      enum: ["low", "medium", "high"],
      description: "How confident the model is in this assessment.",
      nullable: false,
    },
  },
  required: ["risk_state", "reasoning", "suggest_replan", "confidence"],
};

export async function riskAssess(input: {
  task_title: string;
  total_effort_hours: number;
  time_left_hours: number;
  substeps_total: number;
  substeps_completed: number;
  hours_since_last_touched: number;
  user_velocity_profile: "fast_starter" | "steady" | "procrastinator" | "unknown";
}): Promise<{
  risk_state: "calm" | "watch" | "at_risk" | "critical";
  reasoning: string;
  suggest_replan: boolean;
  confidence: "low" | "medium" | "high";
}> {
  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: RISK_ASSESS_SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: RISK_ASSESS_RESPONSE_SCHEMA,
    },
    contents: [
      {
        role: "user",
        parts: [{ text: JSON.stringify(input) }],
      },
    ],
  });

  const raw = result.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
  return JSON.parse(raw);
}

export const CASCADE_REPLAN_SYSTEM_PROMPT = `
You are the Schedule Replan core of Momentum, an AI productivity agent.
You are triggered when one or more tasks have gone critical or a user has 
confirmed they will miss a deadline.

You will receive a JSON object with:
- triggered_by: the task_id that caused the cascade
- current_time_iso: the current ISO timestamp
- task_queue: an array of ALL active tasks, each containing:
  - id, title, deadline, effort_hours_remaining, 
    priority ("high" | "medium" | "low"), 
    substeps (array with completed flags)

YOUR JOB:
Evaluate the entire task queue holistically and produce a realistic reshuffled schedule.

REPLAN RULES — follow these strictly:
1. The triggered task's deadline should be pushed to the nearest realistic 
   slot given its remaining effort.
2. High priority tasks must never be pushed past medium or low priority tasks.
3. Do not push any task's new deadline beyond its original deadline by more 
   than 48 hours unless there is absolutely no alternative.
4. Preserve the order of high-priority tasks relative to each other.
5. If two tasks have the same priority, prefer shifting the one with more buffer first.
6. Never suggest deleting or dropping a task — only reschedule.
7. Return ONLY tasks whose deadlines actually changed in the diff. 
   Do not include unchanged tasks.

Return a before/after diff array so the user can approve with one tap.
Be concise in your reasoning — one sentence per shifted task explaining why it moved.
`;

export const CASCADE_REPLAN_RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "1-2 sentence plain English summary of what changed and why.",
      nullable: false,
    },
    affected_tasks: {
      type: Type.ARRAY,
      description: "Only tasks whose deadlines changed.",
      items: {
        type: Type.OBJECT,
        properties: {
          task_id: { type: Type.STRING, nullable: false },
          task_title: { type: Type.STRING, nullable: false },
          before_deadline: { type: Type.STRING, description: "ISO string", nullable: false },
          after_deadline: { type: Type.STRING, description: "ISO string", nullable: false },
          shift_reasoning: { type: Type.STRING, nullable: false },
        },
        required: ["task_id", "task_title", "before_deadline", "after_deadline", "shift_reasoning"],
      },
      nullable: false,
    },
    confidence: {
      type: Type.STRING,
      enum: ["low", "medium", "high"],
      nullable: false,
    },
  },
  required: ["summary", "affected_tasks", "confidence"],
};

export async function cascadeReplan(input: {
  triggered_by: string;
  current_time_iso: string;
  task_queue: {
    id: string;
    title: string;
    deadline: string;
    effort_hours_remaining: number;
    priority: "high" | "medium" | "low";
    substeps: { label: string; completed: boolean }[];
  }[];
}): Promise<{
  summary: string;
  affected_tasks: {
    task_id: string;
    task_title: string;
    before_deadline: string;
    after_deadline: string;
    shift_reasoning: string;
  }[];
  confidence: "low" | "medium" | "high";
}> {
  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: CASCADE_REPLAN_SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: CASCADE_REPLAN_RESPONSE_SCHEMA,
    },
    contents: [
      {
        role: "user",
        parts: [{ text: JSON.stringify(input) }],
      },
    ],
  });

  const raw = result.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
  return JSON.parse(raw);
}

export const GENERATE_ARTIFACT_SYSTEM_PROMPT = `
You are the Artifact Generator core of Momentum, an AI productivity agent.
Your job is to generate a highly targeted, immediately actionable working 
artifact for a specific sub-step of a task.

You will receive a JSON object with:
- task_title: string (the parent task)
- task_category: string (e.g. "writing", "coding", "research", "planning")
- substep_label: string (the specific sub-step to generate an artifact for)
- substep_index: number (0-based position in the overall task)
- total_substeps: number
- raw_context: string (the user's original brain-dump notes for the parent task)
- artifact_type: "outline" | "checklist" | "template" | "draft" | "auto"

YOUR JOB:
Generate a single, highly focused artifact that unblocks the user 
for THIS specific substep immediately.

ARTIFACT RULES — follow these strictly:
1. If artifact_type is "auto", infer the best type:
   - "writing" or "research" tasks → "outline" or "draft"
   - "coding" tasks → "checklist" or "template"
   - "planning" tasks → "checklist"
2. The artifact must be specific to the substep_label — never generic.
   Bad: "Introduction\n- Write something\n- Add details"
   Good: "Introduction\n- Hook: State the core problem in one sentence\n- 
          Context: 2-3 lines on why this matters now\n- Thesis: Your proposed solution"
3. Use markdown formatting. Use ## for sections, - for list items, 
   **bold** for key actions.
4. Length must match the complexity of the substep:
   - Simple substeps: 5-10 lines
   - Complex substeps: up to 25 lines max. Never exceed 25 lines.
5. Always start with a single ## heading that names the substep.
6. If raw_context contains relevant details, weave them into the artifact.
   Do not ignore the user's own notes.
7. End with a single "--- Next Step ---" line naming what substep_index + 1 
   will be, so the user knows what comes after. 
   If this is the last substep, write "--- Final Step: Review & Submit ---" instead.
`;

export const GENERATE_ARTIFACT_RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    artifact_type: {
      type: Type.STRING,
      enum: ["outline", "checklist", "template", "draft"],
      description: "The type of artifact that was generated.",
      nullable: false,
    },
    artifact_markdown: {
      type: Type.STRING,
      description: "The full markdown content of the artifact.",
      nullable: false,
    },
    substep_label: {
      type: Type.STRING,
      description: "The substep this artifact was generated for.",
      nullable: false,
    },
    estimated_completion_mins: {
      type: Type.NUMBER,
      description: "Rough estimate in minutes for how long this substep will take.",
      nullable: false,
    },
  },
  required: [
    "artifact_type",
    "artifact_markdown", 
    "substep_label",
    "estimated_completion_mins"
  ],
};

export async function generateArtifact(input: {
  task_title: string;
  task_category: string;
  substep_label: string;
  substep_index: number;
  total_substeps: number;
  raw_context: string;
  artifact_type: "outline" | "checklist" | "template" | "draft" | "auto";
}): Promise<{
  artifact_type: "outline" | "checklist" | "template" | "draft";
  artifact_markdown: string;
  substep_label: string;
  estimated_completion_mins: number;
}> {
  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: GENERATE_ARTIFACT_SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: GENERATE_ARTIFACT_RESPONSE_SCHEMA,
    },
    contents: [
      {
        role: "user",
        parts: [{ text: JSON.stringify(input) }],
      },
    ],
  });

  const raw = result.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
  return JSON.parse(raw);
}

