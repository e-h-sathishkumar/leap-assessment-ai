import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const question = await req.json();

    const prompt = `
You are an expert NEET/JEE Question Reviewer.

Review the following question.

Return ONLY valid JSON.

Schema:

{
  "grammar":"Excellent|Good|Needs Improvement",
  "correctAnswer":"Valid|Invalid",
  "difficulty":"Easy|Medium|Hard",
  "blueprint":"Aligned|Not Aligned",
  "duplicate":"Yes|No",
  "qualityScore":95,
  "suggestions":[
      "...",
      "...",
      "..."
  ]
}

Question:

${JSON.stringify(question)}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let text = response.text ?? "";

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return NextResponse.json(JSON.parse(text));

  } catch (err: any) {

    return NextResponse.json(
      {
        error: err.message,
      },
      {
        status: 500,
      }
    );
  }
}