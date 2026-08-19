import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function getStudentDashboardData() {
  const supabase = await createSupabaseServerClient();

  // --------------------------------------------------
  // CURRENT STUDENT
  // --------------------------------------------------

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) { 
    throw new Error("Student is not authenticated.");
  }

  // --------------------------------------------------
  // AVAILABLE TESTS
  // --------------------------------------------------

  const { data: availableTests, error: testsError } =
    await supabase
      .from("tests")
      .select(`
        *,
        subjects (
          id,
          name
        )
      `)
      .eq("status", "Published")
      .order("created_at", { ascending: false });

  if (testsError) {
    throw testsError;
  }

  // --------------------------------------------------
  // COMPLETED ATTEMPTS FOR THIS STUDENT
  // --------------------------------------------------

  const { data: completedAttempts, error: attemptsError } =
    await supabase
      .from("test_attempts")
      .select(`
        *,
        tests (
          id,
          title,
          total_questions,
          total_marks,
          subjects (
            id,
            name
          )
        )
      `)
      .eq("student_id", user.id)
      .eq("status", "Completed")
      .order("submitted_at", { ascending: false });

  if (attemptsError) {
    throw attemptsError;
  }

  const attempts = completedAttempts ?? [];

  // --------------------------------------------------
  // STATISTICS
  // --------------------------------------------------

  const testsCompleted = attempts.length;

  const averageScore =
    testsCompleted === 0
      ? 0
      : Number(
          (
            attempts.reduce(
              (sum, attempt) =>
                sum + Number(attempt.percentage ?? 0),
              0
            ) / testsCompleted
          ).toFixed(2)
        );

  const averageAccuracy =
    testsCompleted === 0
      ? 0
      : Number(
          (
            attempts.reduce(
              (sum, attempt) =>
                sum + Number(attempt.accuracy ?? 0),
              0
            ) / testsCompleted
          ).toFixed(2)
        );

  return {
    user,

    availableTests: availableTests ?? [],

    completedAttempts: attempts,

    statistics: {
      testsAvailable: availableTests?.length ?? 0,
      testsCompleted,
      averageScore,
      averageAccuracy,
    },
  };
}