import { GoogleGenAI, Type, Schema } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

export const decomposeTask = async (title: string, rawInput: string, deadline: string) => {
  const prompt = `Task Title: ${title}\nExtra Context: ${rawInput}\nDeadline: ${deadline}`;
  
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
