import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const AGENT_CHAT_SYSTEM_PROMPT = "You are a test agent.";

async function test() {
  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: AGENT_CHAT_SYSTEM_PROMPT,
      },
      contents: [
        {
          role: "user",
          parts: [{
            text: "Hello!"
          }],
        },
      ],
    });
    console.log("SUCCESS:", result.candidates?.[0]?.content?.parts?.[0]?.text);
  } catch (e) {
    console.error("ERROR:", e);
  }
}

test();
