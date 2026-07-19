import { NextResponse } from "next/server";
import { publishTest } from "@/services/test.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log("========== PUBLISH REQUEST ==========");
    console.log(body);

    const testId = Number(body.testId);

    console.log("Publishing Test ID:", testId);

    await publishTest(testId);

    console.log("Publish completed successfully.");

    return NextResponse.json({
      success: true,
      message: "Test published successfully.",
    });
  } catch (error) {
    console.error("========== PUBLISH ERROR ==========");
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to publish test.",
      },
      {
        status: 500,
      }
    );
  }
}