import { NextRequest, NextResponse } from "next/server";
import { submitAttempt } from "@/services/test.service";

interface RouteProps {
  params: Promise<{
    attemptId: string;
  }>;
}

export async function POST(
  request: NextRequest,
  { params }: RouteProps
) {
  try {
    const { attemptId } = await params;

    const result = await submitAttempt(
      Number(attemptId)
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to submit test.",
      },
      {
        status: 500,
      }
    );
  }
}