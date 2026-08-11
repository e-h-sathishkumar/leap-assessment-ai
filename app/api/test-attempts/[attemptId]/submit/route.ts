import { NextResponse } from "next/server";

import { submitAttempt } from "@/services/test.service";

interface RouteContext {
  params: Promise<{
    attemptId: string;
  }>;
}

export async function POST(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { attemptId } = await params;

    console.log(
      "========================================"
    );

    console.log(
      "SUBMIT TEST API"
    );

    console.log(
      "Attempt ID:",
      attemptId
    );

    console.log(
      "========================================"
    );

    const numericAttemptId =
      Number(attemptId);

    if (
      !Number.isInteger(
        numericAttemptId
      ) ||
      numericAttemptId <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid attempt ID.",
        },
        {
          status: 400,
        }
      );
    }

    const result =
      await submitAttempt(
        numericAttemptId
      );

    console.log(
      "========== SUBMIT RESULT =========="
    );

    console.log(
      result
    );

    console.log(
      "===================================="
    );

    return NextResponse.json(
      result,
      {
        status: 200,
      }
    );

  } catch (error) {
    console.error(
      "========================================"
    );

    console.error(
      "SUBMIT TEST API ERROR"
    );

    console.error(
      "========================================"
    );

    console.error(
      "Error:",
      error
    );

    if (
      error &&
      typeof error === "object"
    ) {
      console.error(
        "Error JSON:",
        JSON.stringify(
          error,
          null,
          2
        )
      );
    }

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Failed to submit test.",

        details:
          error &&
          typeof error === "object"
            ? error
            : undefined,
      },
      {
        status: 500,
      }
    );
  }
}