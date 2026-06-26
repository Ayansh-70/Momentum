"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AGENT_CHAT_SYSTEM_PROMPT = exports.GENERATE_ARTIFACT_RESPONSE_SCHEMA = exports.GENERATE_ARTIFACT_SYSTEM_PROMPT = exports.CASCADE_REPLAN_RESPONSE_SCHEMA = exports.CASCADE_REPLAN_SYSTEM_PROMPT = exports.RISK_ASSESS_RESPONSE_SCHEMA = exports.RISK_ASSESS_SYSTEM_PROMPT = exports.decomposeTask = exports.DECOMPOSE_RESPONSE_SCHEMA = exports.DECOMPOSE_SYSTEM_PROMPT = void 0;
exports.riskAssess = riskAssess;
exports.cascadeReplan = cascadeReplan;
exports.generateArtifact = generateArtifact;
exports.agentChat = agentChat;
const genai_1 = require("@google/genai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
exports.DECOMPOSE_SYSTEM_PROMPT = `You are the planning module of Momentum, a productivity agent that helps people 
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
exports.DECOMPOSE_RESPONSE_SCHEMA = {
    type: genai_1.Type.OBJECT,
    properties: {
        category: { type: genai_1.Type.STRING, enum: ["assignment", "bill", "interview", "meeting", "custom"] },
        effortEstimateMins: { type: genai_1.Type.NUMBER },
        subSteps: {
            type: genai_1.Type.ARRAY,
            items: {
                type: genai_1.Type.OBJECT,
                properties: {
                    title: { type: genai_1.Type.STRING },
                    subDeadline: { type: genai_1.Type.STRING, format: "date-time" }, // Cast to any to handle format if not in Type enum
                    estimateMins: { type: genai_1.Type.NUMBER }
                },
                required: ["title", "subDeadline", "estimateMins"]
            }
        },
        starterArtifact: {
            type: genai_1.Type.OBJECT,
            properties: {
                type: { type: genai_1.Type.STRING, enum: ["outline", "checklist", "info_summary", "question_list", "template"] },
                title: { type: genai_1.Type.STRING },
                content: { type: genai_1.Type.STRING }
            },
            required: ["type", "title", "content"]
        }
    },
    required: ["category", "effortEstimateMins", "subSteps", "starterArtifact"]
};
const decomposeTask = async (title, rawInput, deadline, currentTimeISO) => {
    const prompt = `Task Title: ${title}\nExtra Context: ${rawInput}\nDeadline: ${deadline}\nCurrent Date/Time: ${currentTimeISO}`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: exports.DECOMPOSE_SYSTEM_PROMPT,
            responseMimeType: 'application/json',
            responseSchema: exports.DECOMPOSE_RESPONSE_SCHEMA,
            temperature: 0.2,
        }
    });
    const text = response.text;
    if (!text)
        throw new Error("No response from Gemini");
    return JSON.parse(text);
};
exports.decomposeTask = decomposeTask;
exports.RISK_ASSESS_SYSTEM_PROMPT = `
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
exports.RISK_ASSESS_RESPONSE_SCHEMA = {
    type: genai_1.Type.OBJECT,
    properties: {
        risk_state: {
            type: genai_1.Type.STRING,
            enum: ["calm", "watch", "at_risk", "critical"],
            description: "The evaluated risk level of the task.",
            nullable: false,
        },
        reasoning: {
            type: genai_1.Type.STRING,
            description: "1-2 sentence explanation of why this risk state was assigned.",
            nullable: false,
        },
        suggest_replan: {
            type: genai_1.Type.BOOLEAN,
            description: "Whether to trigger cascadeReplan. True only for critical, and optionally for at_risk.",
            nullable: false,
        },
        confidence: {
            type: genai_1.Type.STRING,
            enum: ["low", "medium", "high"],
            description: "How confident the model is in this assessment.",
            nullable: false,
        },
    },
    required: ["risk_state", "reasoning", "suggest_replan", "confidence"],
};
async function riskAssess(input) {
    const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
            systemInstruction: exports.RISK_ASSESS_SYSTEM_PROMPT,
            responseMimeType: "application/json",
            responseSchema: exports.RISK_ASSESS_RESPONSE_SCHEMA,
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
exports.CASCADE_REPLAN_SYSTEM_PROMPT = `
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
exports.CASCADE_REPLAN_RESPONSE_SCHEMA = {
    type: genai_1.Type.OBJECT,
    properties: {
        summary: {
            type: genai_1.Type.STRING,
            description: "1-2 sentence plain English summary of what changed and why.",
            nullable: false,
        },
        affected_tasks: {
            type: genai_1.Type.ARRAY,
            description: "Only tasks whose deadlines changed.",
            items: {
                type: genai_1.Type.OBJECT,
                properties: {
                    task_id: { type: genai_1.Type.STRING, nullable: false },
                    task_title: { type: genai_1.Type.STRING, nullable: false },
                    before_deadline: { type: genai_1.Type.STRING, description: "ISO string", nullable: false },
                    after_deadline: { type: genai_1.Type.STRING, description: "ISO string", nullable: false },
                    shift_reasoning: { type: genai_1.Type.STRING, nullable: false },
                },
                required: ["task_id", "task_title", "before_deadline", "after_deadline", "shift_reasoning"],
            },
            nullable: false,
        },
        confidence: {
            type: genai_1.Type.STRING,
            enum: ["low", "medium", "high"],
            nullable: false,
        },
    },
    required: ["summary", "affected_tasks", "confidence"],
};
async function cascadeReplan(input) {
    const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
            systemInstruction: exports.CASCADE_REPLAN_SYSTEM_PROMPT,
            responseMimeType: "application/json",
            responseSchema: exports.CASCADE_REPLAN_RESPONSE_SCHEMA,
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
exports.GENERATE_ARTIFACT_SYSTEM_PROMPT = `
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
exports.GENERATE_ARTIFACT_RESPONSE_SCHEMA = {
    type: genai_1.Type.OBJECT,
    properties: {
        artifact_type: {
            type: genai_1.Type.STRING,
            enum: ["outline", "checklist", "template", "draft"],
            description: "The type of artifact that was generated.",
            nullable: false,
        },
        artifact_markdown: {
            type: genai_1.Type.STRING,
            description: "The full markdown content of the artifact.",
            nullable: false,
        },
        substep_label: {
            type: genai_1.Type.STRING,
            description: "The substep this artifact was generated for.",
            nullable: false,
        },
        estimated_completion_mins: {
            type: genai_1.Type.NUMBER,
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
async function generateArtifact(input) {
    const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
            systemInstruction: exports.GENERATE_ARTIFACT_SYSTEM_PROMPT,
            responseMimeType: "application/json",
            responseSchema: exports.GENERATE_ARTIFACT_RESPONSE_SCHEMA,
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
exports.AGENT_CHAT_SYSTEM_PROMPT = `
You are the Agent Core of Momentum, an AI productivity assistant.
You have full visibility into the user's active task queue.
Your job is to answer questions about their workload, help them
prioritize, surface risks, and give actionable advice.

You will receive:
- tasks: the user's full active task queue as JSON, including
  each task's title, deadline, risk state, substeps, effort 
  estimate, category, and completion status
- current_time_iso: the current timestamp
- message: the user's question or request

YOUR PERSONALITY:
- Direct and confident. Never vague.
- Use specific task names and numbers from the actual data.
- If asked what to work on, give a concrete single answer.
- If asked about risk, cite the specific signals (time left, 
  completion %, inactivity).
- Keep responses concise — 2-5 sentences max unless the user 
  asks for a detailed breakdown.
- Never say "I don't have access to" — you always have the 
  full task queue in context.
- Refer to yourself as "the Agent Core" not "I" or "Claude".

EXAMPLE INTERACTIONS:
User: "What should I work on first?"
Agent: "Focus on [task name] — it's at critical risk with only 
        3 hours left and 4 substeps incomplete. Everything else 
        has comfortable buffer."

User: "How much work do I have left this week?"
Agent: "You have approximately 14 hours of effort across 3 active 
        tasks. The heaviest is [task name] at 6 hours remaining."

User: "Am I going to miss any deadlines?"
Agent: "Yes — [task name] is critical. At your current pace you 
        will miss it by roughly 4 hours. The Agent Core recommends 
        triggering a replan immediately."
`;
async function agentChat(input) {
    const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
            systemInstruction: exports.AGENT_CHAT_SYSTEM_PROMPT,
        },
        contents: [
            {
                role: "user",
                parts: [{
                        text: `Current time: ${input.current_time_iso}
                 
Active task queue:
${JSON.stringify(input.tasks, null, 2)}

User message: ${input.message}`
                    }],
            },
        ],
    });
    const reply = result.candidates?.[0]?.content?.parts?.[0]?.text ??
        "The Agent Core is unavailable right now.";
    return { reply };
}
//# sourceMappingURL=gemini.js.map