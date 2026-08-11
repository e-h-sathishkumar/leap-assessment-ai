import { NextResponse } from "next/server";

import { generateQuestions } from "@/lib/ai/question-generator";
import type { PromptRequest } from "@/lib/ai/types";

export async function POST(request: Request) {
  try {
    const body =
      (await request.json()) as PromptRequest;

    console.log(
      "========== API REQUEST =========="
    );

    console.log(
      JSON.stringify(
        body,
        null,
        2
      )
    );

    // -----------------------------------------
    // REQUIRED
    // -----------------------------------------

    if (!body.exam?.trim()) {
      return NextResponse.json(
        {
          error:
            "Exam / Framework is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!body.className?.trim()) {
      return NextResponse.json(
        {
          error:
            "Class is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!body.subject?.trim()) {
      return NextResponse.json(
        {
          error:
            "Subject is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !body.numberOfQuestions ||
      body.numberOfQuestions < 1
    ) {
      return NextResponse.json(
        {
          error:
            "Number of questions must be at least 1.",
        },
        {
          status: 400,
        }
      );
    }

    // -----------------------------------------
    // OPTIONAL CHAPTER / TOPIC
    // -----------------------------------------
    //
    // Empty chapter/topic are VALID.
    //
    // Subject + Class + Exam are sufficient
    // for AI generation.
    //

    const normalizedBody: PromptRequest = {
      ...body,

      chapter:
        body.chapter?.trim() || "",

      topic:
        body.topic?.trim() || "",

      additionalInstructions:
        body.additionalInstructions?.trim() ||
        "",
    };

    console.log(
      "========== NORMALIZED ACADEMIC SCOPE =========="
    );

    console.log({
      exam:
        normalizedBody.exam,

      className:
        normalizedBody.className,

      subject:
        normalizedBody.subject,

      chapter:
        normalizedBody.chapter ||
        "(AI may choose)",

      topic:
        normalizedBody.topic ||
        "(AI may choose)",
    });

    // -----------------------------------------
    // GENERATE
    // -----------------------------------------

    const result =
      await generateQuestions(
        normalizedBody
      );

    console.log(
      "========== API RESULT =========="
    );

    console.log(
      JSON.stringify(
        result,
        null,
        2
      )
    );

    return NextResponse.json(
      result
    );
  } catch (error) {
    console.error(
      "========== API ERROR =========="
    );

    console.error(
      error
    );

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