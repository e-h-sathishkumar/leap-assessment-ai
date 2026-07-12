import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(req: Request) {
  try {
    const { exam, subject, chapter, topic, questionType, totalQuestions } = await req.json();

    // 1. Defined schema matches your Frontend AIQuestion interface
    const prompt = `
Generate ${totalQuestions} ${questionType} questions for ${exam}.

Subject: ${subject}
Chapter: ${chapter}
Topic: ${topic}

Return ONLY valid JSON.
Schema:
{
  "questions": [
    {
      "question": "...",
      "questionType": "${questionType}",
      "difficulty": "Medium",
      "options": {
        "A": "...",
        "B": "...",
        "C": "...",
        "D": "..."
      },
      "correct_answer": "A",
      "explanation": "..."
    }
  ]
}
`;

    let lastError: any = null;

    // Retry loop for API stability
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            // This forces Gemini to output pure JSON
            responseMimeType: "application/json",
          },
        });

        const text = response.text ?? "{}";

        // 2. Fail-Safe Extraction: Use Regex to find the JSON object 
        // even if the AI adds filler text before or after the JSON.
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : text;

        const data = JSON.parse(jsonString);

        // 3. Return the data
        return NextResponse.json(data);

      } catch (err: any) {
        lastError = err;
        console.error(`Attempt ${attempt} failed:`, err.message);

        // Retry only on network/rate-limit errors
        if (
          err?.message?.includes("503") ||
          err?.message?.includes("UNAVAILABLE") ||
          err?.message?.includes("high demand") ||
          err instanceof SyntaxError // Retry if JSON parsing failed
        ) {
          await sleep(2000);
          continue;
        }
        throw err;
      }
    }

    return NextResponse.json(
      { error: "Gemini is unavailable. Please try again.", details: lastError?.message },
      { status: 503 }
    );
  } catch (error: any) {
    console.error("Critical API Error:", error);
    return NextResponse.json(
      { error: error.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}