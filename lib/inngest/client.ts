import { Inngest } from "inngest";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

let aiConfig = undefined;
if (GEMINI_API_KEY) {
  aiConfig = { gemini: { apiKey: GEMINI_API_KEY } };
} else {
  console.warn("[Inngest] GEMINI_API_KEY not set; initializing without AI-Gemini integration.");
}

export const inngest = new Inngest({
  id: "stoxwatch",
  ai: aiConfig,
});