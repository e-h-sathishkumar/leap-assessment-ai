import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function getStudentDashboardData() {
  const supabase = await createSupabaseServerClient();

  // ============================================================
  // CURRENT STUDENT
  // ============================================================

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Student is not authenticated.");
  }

  // ============================================================
  // AVAILABLE TESTS
  // ============================================================

  const {
    data: availableTests,
    error: testsError,
  } = await supabase
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

  // ============================================================
  // COMPLETED ATTEMPTS
  // ============================================================

  const {
    data: completedAttempts,
    error: attemptsError,
  } = await supabase
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

  // ============================================================
  // BASIC STATISTICS
  // ============================================================

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

  // ============================================================
  // ANSWER STATISTICS
  // ============================================================

  const totalCorrect = attempts.reduce(
    (sum, attempt) =>
      sum + Number(attempt.correct ?? 0),
    0
  );

  const totalWrong = attempts.reduce(
    (sum, attempt) =>
      sum + Number(attempt.wrong ?? 0),
    0
  );

  const totalSkipped = attempts.reduce(
    (sum, attempt) =>
      sum + Number(attempt.skipped ?? 0),
    0
  );

  const averageDurationSeconds =
    testsCompleted === 0
      ? 0
      : Math.round(
          attempts.reduce(
            (sum, attempt) =>
              sum +
              Number(
                attempt.duration_seconds ?? 0
              ),
            0
          ) / testsCompleted
        );

  // ============================================================
  // SUBJECT PERFORMANCE
  // ============================================================

  const subjectMap = new Map<
    string,
    {
      subjectId: number | null;
      subject: string;
      subjectName: string;
      tests: number;
      correct: number;
      wrong: number;
      skipped: number;
      totalQuestions: number;
      totalPercentage: number;
      totalAccuracy: number;
    }
  >();

  for (const attempt of attempts) {
    const subject = attempt.tests?.subjects;

    if (!subject) {
      continue;
    }

    const subjectData = Array.isArray(subject)
      ? subject[0]
      : subject;

    if (!subjectData) {
      continue;
    }

    const key = String(subjectData.id);

    const existing = subjectMap.get(key);

    if (existing) {
      existing.tests += 1;

      existing.correct += Number(
        attempt.correct ?? 0
      );

      existing.wrong += Number(
        attempt.wrong ?? 0
      );

      existing.skipped += Number(
        attempt.skipped ?? 0
      );

      existing.totalQuestions += Number(
        attempt.tests?.total_questions ?? 0
      );

      existing.totalPercentage += Number(
        attempt.percentage ?? 0
      );

      existing.totalAccuracy += Number(
        attempt.accuracy ?? 0
      );
    } else {
      subjectMap.set(key, {
        subjectId: subjectData.id ?? null,

        subject:
          subjectData.name ?? "Unknown",

        subjectName:
          subjectData.name ?? "Unknown",

        tests: 1,

        correct: Number(
          attempt.correct ?? 0
        ),

        wrong: Number(
          attempt.wrong ?? 0
        ),

        skipped: Number(
          attempt.skipped ?? 0
        ),

        totalQuestions: Number(
          attempt.tests?.total_questions ?? 0
        ),

        totalPercentage: Number(
          attempt.percentage ?? 0
        ),

        totalAccuracy: Number(
          attempt.accuracy ?? 0
        ),
      });
    }
  }

  // ============================================================
  // SUBJECT PERFORMANCE ARRAY
  // ============================================================

  const subjectPerformance = Array.from(
    subjectMap.values()
  )
    .map((subject) => ({
      subjectId: subject.subjectId,

      subject: subject.subject,

      subjectName: subject.subjectName,

      tests: subject.tests,

      correct: subject.correct,

      wrong: subject.wrong,

      skipped: subject.skipped,

      totalQuestions:
        subject.totalQuestions,

      averageScore: Number(
        (
          subject.totalPercentage /
          subject.tests
        ).toFixed(2)
      ),

      averageAccuracy: Number(
        (
          subject.totalAccuracy /
          subject.tests
        ).toFixed(2)
      ),
    }))
    .sort(
      (a, b) =>
        b.averageScore -
        a.averageScore
    );

  // ============================================================
  // STRONGEST SUBJECT
  // ============================================================

  const strongestSubject =
    subjectPerformance.length > 0
      ? subjectPerformance[0]
      : null;

  // ============================================================
  // WEAKEST SUBJECT
  // ============================================================

  const weakestSubject =
    subjectPerformance.length > 0
      ? subjectPerformance[
          subjectPerformance.length - 1
        ]
      : null;

  // ============================================================
  // RECENT PERFORMANCE
  // ============================================================

  const recentPerformance = attempts
    .slice(0, 10)
    .map((attempt) => {
      const subject = attempt.tests?.subjects;

      const subjectData = Array.isArray(subject)
        ? subject[0]
        : subject;

      return {
        // Original database attempt ID
        // exposed as attemptId to the dashboard
        attemptId: attempt.id,

        // Test information
        testId:
          attempt.tests?.id ?? null,

        testTitle:
          attempt.tests?.title ??
          "Untitled Test",

        // Subject information
        subject:
          subjectData?.name ??
          "Unknown Subject",

        // Score information
        score: Number(
          attempt.score ?? 0
        ),

        percentage: Number(
          attempt.percentage ?? 0
        ),

        accuracy: Number(
          attempt.accuracy ?? 0
        ),

        // Answer information
        correct: Number(
          attempt.correct ?? 0
        ),

        wrong: Number(
          attempt.wrong ?? 0
        ),

        skipped: Number(
          attempt.skipped ?? 0
        ),

        // Time information
        durationSeconds: Number(
          attempt.duration_seconds ?? 0
        ),

        // Submission information
        submittedAt:
          attempt.submitted_at ?? null,
      };
    });

  // ============================================================
  // RETURN DASHBOARD DATA
  // ============================================================

  return {
    user,

    // ----------------------------------------------------------
    // AVAILABLE TESTS
    // ----------------------------------------------------------

    availableTests:
      availableTests ?? [],

    // ----------------------------------------------------------
    // COMPLETED ATTEMPTS
    // ----------------------------------------------------------

    completedAttempts:
      attempts,

    // ----------------------------------------------------------
    // STATISTICS
    // ----------------------------------------------------------

    statistics: {
      testsAvailable:
        availableTests?.length ?? 0,

      testsCompleted,

      averageScore,

      averageAccuracy,

      totalCorrect,

      totalWrong,

      totalSkipped,

      averageDurationSeconds,
    },

    // ----------------------------------------------------------
    // ANALYTICS
    // ----------------------------------------------------------

    analytics: {
      strongestSubject,

      weakestSubject,

      subjectPerformance,

      recentPerformance,
    },
  };
}