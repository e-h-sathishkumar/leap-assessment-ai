import { NextResponse } from "next/server";

import { createTestWithQuestions } from "@/services/test.service";

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
  console.error("========== API ERROR ==========");
  console.error(error);

  return NextResponse.json(
    {
      success: false,
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