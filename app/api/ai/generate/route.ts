import { NextResponse } from "next/server";

import { generateQuestions } from "@/lib/ai/question-generator";
import type { PromptRequest } from "@/lib/ai/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PromptRequest;

    console.log("========== API REQUEST ==========");
    console.log(body);

    const result = await generateQuestions(body);

    console.log("========== API RESULT ==========");
    console.log(result);

    return NextResponse.json(result);

  } catch (error) {
    console.error("========== API ERROR ==========");
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate questions.",
      },
      {
        status: 500,
      }
    );
  }
}