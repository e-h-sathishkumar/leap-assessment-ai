import { NextResponse } from "next/server";

import { createTestAttempt } from "@/services/test.service";

export async function POST(request: Request) {
  try {
    const { testId, studentId } = await request.json();

    console.log("Incoming Request:", {
      testId,
      studentId,
    });

    const attempt = await createTestAttempt(
      testId,
      studentId
    );

    console.log("Attempt Created:", attempt);

    return NextResponse.json(attempt);

  } catch (error) {

    console.error(
      "Create Attempt Error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : JSON.stringify(error),
      },
      {
        status: 500,
      }
    );
  }
}