import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function getAttemptByIdServer(
  attemptId: string
) {
  // -----------------------------------------------------
  // VALIDATE ATTEMPT ID
  // -----------------------------------------------------

  const numericAttemptId = Number(attemptId);

  if (
    !Number.isInteger(numericAttemptId) ||
    numericAttemptId <= 0
  ) {
    return null;
  }

  // -----------------------------------------------------
  // SUPABASE SERVER CLIENT
  // -----------------------------------------------------

  const supabase =
    await createSupabaseServerClient();

  // -----------------------------------------------------
  // CURRENT AUTHENTICATED USER
  // -----------------------------------------------------

  const {
    data: {
      user,
    },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error(
      "GET CURRENT USER ERROR:",
      userError
    );

    throw userError;
  }

  if (!user) {
    console.error(
      "NO AUTHENTICATED STUDENT"
    );

    return null;
  }

  // -----------------------------------------------------
  // LOAD ATTEMPT
  // -----------------------------------------------------

  const {
    data: attempt,
    error: attemptError,
  } = await supabase
    .from("test_attempts")
    .select("*")
    .eq("id", numericAttemptId)
    .maybeSingle();

  if (attemptError) {
    console.error(
      "LOAD ATTEMPT ERROR:",
      attemptError
    );

    throw attemptError;
  }

  if (!attempt) {
    console.error(
      "ATTEMPT NOT FOUND:",
      numericAttemptId
    );

    return null;
  }

  // -----------------------------------------------------
  // VERIFY STUDENT OWNS THIS ATTEMPT
  // -----------------------------------------------------

  if (
    String(attempt.student_id) !==
    String(user.id)
  ) {
    console.error(
      "UNAUTHORIZED ATTEMPT ACCESS:",
      numericAttemptId
    );

    return null;
  }

  // -----------------------------------------------------
  // LOAD TEST
  // -----------------------------------------------------

  const {
    data: test,
    error: testError,
  } = await supabase
    .from("tests")
    .select("*")
    .eq("id", Number(attempt.test_id))
    .maybeSingle();

  if (testError) {
    console.error(
      "LOAD TEST ERROR:",
      testError
    );

    throw testError;
  }

  if (!test) {
    throw new Error(
      `Test ${attempt.test_id} was not found.`
    );
  }

  // -----------------------------------------------------
  // LOAD TEST QUESTIONS
  // -----------------------------------------------------

  const {
    data: testQuestions,
    error: questionError,
  } = await supabase
    .from("test_questions")
    .select(`
      id,
      question_order,
      marks,
      negative_marks,
      questions (
        *,
        chapters (
          id,
          name
        ),
        student_answers (*)
      )
    `)
    .eq(
      "test_id",
      Number(attempt.test_id)
    )
    .order("question_order", {
      ascending: true,
    });

  if (questionError) {
    console.error(
      "LOAD TEST QUESTIONS ERROR:",
      questionError
    );

    throw questionError;
  }

  // -----------------------------------------------------
  // FILTER ANSWERS FOR CURRENT ATTEMPT
  // -----------------------------------------------------

  const questions =
    (testQuestions ?? []).map(
      (testQuestion: any) => ({
        ...testQuestion,

        questions: {
          ...testQuestion.questions,

          student_answers:
            (
              testQuestion.questions
                ?.student_answers ?? []
            ).filter(
              (answer: any) =>
                Number(answer.attempt_id) ===
                numericAttemptId
            ),
        },
      })
    );

  // -----------------------------------------------------
  // CALCULATE RESULT
  // -----------------------------------------------------

  let correct = 0;
  let wrong = 0;
  let skipped = 0;

  for (const testQuestion of questions) {

    const answer =
      testQuestion.questions
        ?.student_answers?.[0];

    // ---------------------------------------------------
    // SKIPPED
    // ---------------------------------------------------

    if (
      !answer ||
      !answer.selected_answer
    ) {
      skipped++;
    }

    // ---------------------------------------------------
    // CORRECT
    // ---------------------------------------------------

    else if (answer.is_correct) {
      correct++;
    }

    // ---------------------------------------------------
    // WRONG
    // ---------------------------------------------------

    else {
      wrong++;
    }
  }

  // -----------------------------------------------------
  // ATTEMPTED
  // -----------------------------------------------------

  const attempted =
    correct + wrong;

  // -----------------------------------------------------
  // ACCURACY
  // -----------------------------------------------------

  const accuracy =
    attempted > 0
      ? Number(
          (
            (correct / attempted) *
            100
          ).toFixed(2)
        )
      : 0;

  // -----------------------------------------------------
  // RETURN COMPLETE RESULT
  // -----------------------------------------------------

  return {
    ...attempt,

    tests: {
      ...test,

      test_questions:
        questions,
    },

    correct,
    wrong,
    skipped,
    attempted,
    accuracy,
  };
}