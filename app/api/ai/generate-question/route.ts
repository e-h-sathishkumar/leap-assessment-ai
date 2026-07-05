import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(req: Request) {
  try {
    const {
      exam,
      subject,
      chapter,
      topic,
      questionType,
      totalQuestions,
    } = await req.json();

    const prompt = `
Generate ${totalQuestions} ${questionType} question(s) for ${exam}.

Subject: ${subject}
Chapter: ${chapter}
Topic: ${topic}

For each question return ONLY valid JSON.

Schema:

{
  "questions":[
    {
      "question":"...",
      "questionType":"${questionType}",
      "difficulty":"Easy",
      "category":"Conceptual",
      "options":[
        "...",
        "...",
        "...",
        "..."
      ],
      "correctAnswer":"A",
      "explanation":"..."
    }
  ]
}

No markdown.
No code block.
JSON only.
`;

    let lastError: any = null;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
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
        lastError = err;

        const msg = err?.message ?? "";

        if (
          msg.includes("503") ||
          msg.includes("UNAVAILABLE") ||
          msg.includes("high demand")
        ) {
          console.log(`Retry ${attempt}/3...`);
          await sleep(2000);
          continue;
        }

        throw err;
      }
    }

    return NextResponse.json(
      {
        error:
          "Gemini is temporarily unavailable. Please try again shortly.",
        details: lastError?.message,
      },
      {
        status: 503,
      }
    );
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        error: error.message ?? "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}