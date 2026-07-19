import { NextResponse } from "next/server";

import {
  createTestWithQuestions,
  deleteTest,
} from "@/services/test.service";

// ----------------------------
// Create Test
// ----------------------------
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const test = await createTestWithQuestions(
      body.form,
      body.questions
    );

    return NextResponse.json({
      success: true,
      test,
    });
  } catch (error) {
    console.error("========== CREATE TEST ERROR ==========");
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create test.",
      },
      {
        status: 500,
      }
    );
  }
}

// ----------------------------
// Delete Test
// ----------------------------
export async function DELETE(request: Request) {
  try {
    const { testId } = await request.json();

    await deleteTest(Number(testId));

    return NextResponse.json({
      success: true,
      message: "Test deleted successfully.",
    });
  } catch (error) {
    console.error("========== DELETE TEST ERROR ==========");
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete test.",
      },
      {
        status: 500,
      }
    );
  }
}