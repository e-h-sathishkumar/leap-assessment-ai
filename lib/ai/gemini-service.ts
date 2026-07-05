import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function generateWithGemini(
  prompt: string
): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  console.log("========== RAW GEMINI RESPONSE ==========");
  console.dir(response, { depth: null });
  console.log("=========================================");

  return response.text ?? "";
}