import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const { testId } = await request.json();

    console.log("Incoming Request:", {
      testId,
    });

    // ==========================================
    // AUTHENTICATED STUDENT
    // ==========================================

    const supabase =
      await createSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error(
        "AUTH ERROR:",
        authError
      );

      return NextResponse.json(
        {
          error: authError.message,
        },
        {
          status: 401,
        }
      );
    }

    if (!user) {
      return NextResponse.json(
        {
          error:
            "Student is not authenticated.",
        },
        {
          status: 401,
        }
      );
    }

    console.log(
      "Authenticated Student:",
      user.id
    );

    // ==========================================
    // CREATE ATTEMPT
    // ==========================================

    const { data: attempt, error } =
      await supabase
        .from("test_attempts")
        .insert({
          test_id: Number(testId),
          student_id: user.id,
          started_at:
            new Date().toISOString(),
          status: "In Progress",
        })
        .select()
        .single();

    console.log(
      "Attempt Created:",
      attempt
    );

    if (error) {
      console.error(
        "========== SUPABASE ERROR =========="
      );

      console.error(
        "Code:",
        error.code
      );

      console.error(
        "Message:",
        error.message
      );

      console.error(
        "Details:",
        error.details
      );

      console.error(
        "Hint:",
        error.hint
      );

      console.error(
        "===================================="
      );

      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
          details: error.details,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      attempt,
      {
        status: 200,
      }
    );
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