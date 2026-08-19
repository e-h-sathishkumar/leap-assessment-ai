import { createSupabaseServerClient } from "@/lib/supabase-server";

// -----------------------------------------------------
// Submit Test Attempt
// -----------------------------------------------------

export async function submitAttempt(
  attemptId: number
) {
  const supabase =
    await createSupabaseServerClient();

  // -----------------------------------------------------
  // LOAD ATTEMPT
  // -----------------------------------------------------

  const {
    data: attempt,
    error: attemptError,
  } = await supabase
    .from("test_attempts")
    .select(`
      *,
      tests (
        id,
        total_questions,
        test_questions (
          id,
          question_order,
          marks,
          negative_marks,
          questions (
            id,
            correct_answer
          )
        )
      )
    `)
    .eq("id", attemptId)
    .single();

  if (attemptError) {
    console.error("LOAD ATTEMPT ERROR:", attemptError);
    throw attemptError;
  }

  if (!attempt) {
    throw new Error("Test attempt was not found.");
  }

  // -----------------------------------------------------
  // LOAD STUDENT ANSWERS
  // -----------------------------------------------------

  const {
    data: answers,
    error: answerError,
  } = await supabase
    .from("student_answers")
    .select("*")
    .eq("attempt_id", attemptId);

  if (answerError) {
    console.error(
      "LOAD STUDENT ANSWERS ERROR:",
      answerError
    );
    throw answerError;
  }

  // -----------------------------------------------------
  // EVALUATE ANSWERS
  // -----------------------------------------------------

  const answerMap = new Map(
    (answers ?? []).map((answer) => [
      Number(answer.question_id),
      answer,
    ])
  );

  let correct = 0;
  let wrong = 0;
  let skipped = 0;
  let totalScore = 0;

  // -----------------------------------------------------
  // CHECK EACH QUESTION
  // -----------------------------------------------------

  for (
    const testQuestion of
    attempt.tests.test_questions
  ) {
    const questionId =
      Number(testQuestion.questions.id);

    const answer =
      answerMap.get(questionId);

    // ---------------------------------------------------
    // SKIPPED
    // ---------------------------------------------------

    if (
      !answer ||
      !answer.selected_answer
    ) {
      skipped++;
      continue;
    }

    // ---------------------------------------------------
    // CHECK ANSWER
    // ---------------------------------------------------

    const isCorrect =
      answer.selected_answer ===
      testQuestion.questions.correct_answer;

    const positiveMarks =
      Number(testQuestion.marks ?? 0);

    const negativeMarks =
      Number(testQuestion.negative_marks ?? 0);

    const marksObtained =
      isCorrect
        ? positiveMarks
        : -negativeMarks;

    // ---------------------------------------------------
    // COUNT RESULT
    // ---------------------------------------------------

    if (isCorrect) {
      correct++;
    } else {
      wrong++;
    }

    totalScore += marksObtained;

    // ---------------------------------------------------
    // SAVE QUESTION RESULT
    // ---------------------------------------------------

    const {
      error: answerUpdateError,
    } = await supabase
      .from("student_answers")
      .update({
        is_correct: isCorrect,
        marks_obtained: marksObtained,
      })
      .eq("id", answer.id);

    if (answerUpdateError) {
      console.error(
        "UPDATE STUDENT ANSWER ERROR:",
        answerUpdateError
      );

      throw answerUpdateError;
    }
  }

  // -----------------------------------------------------
  // TOTAL MARKS
  // -----------------------------------------------------

  const totalMarks =
    attempt.tests.test_questions.reduce(
      (
        sum: number,
        question: any
      ) =>
        sum +
        Number(question.marks ?? 0),
      0
    );

  // -----------------------------------------------------
  // PERCENTAGE
  // -----------------------------------------------------

  const percentage =
    totalMarks === 0
      ? 0
      : Math.max(
          0,
          Number(
            (
              (totalScore / totalMarks) *
              100
            ).toFixed(2)
          )
        );

  // -----------------------------------------------------
  // ATTEMPTED
  // -----------------------------------------------------

  const attempted =
    correct + wrong;

  // -----------------------------------------------------
  // ACCURACY
  // -----------------------------------------------------

  const accuracy =
    attempted === 0
      ? 0
      : Number(
          (
            (correct / attempted) *
            100
          ).toFixed(2)
        );

  // -----------------------------------------------------
  // SUBMISSION TIME
  // -----------------------------------------------------

  const submittedAt =
    new Date();

  // -----------------------------------------------------
  // DURATION
  // -----------------------------------------------------

  const startedAt =
    new Date(attempt.started_at);

  let durationSeconds = 0;

  if (
    !Number.isNaN(
      startedAt.getTime()
    )
  ) {
    durationSeconds =
      Math.max(
        0,
        Math.floor(
          (
            submittedAt.getTime() -
            startedAt.getTime()
          ) / 1000
        )
      );
  }

  // -----------------------------------------------------
  // UPDATE TEST ATTEMPT
  // -----------------------------------------------------

  const {
    error: updateAttemptError,
  } = await supabase
    .from("test_attempts")
    .update({
      submitted_at:
        submittedAt.toISOString(),

      duration_seconds:
        durationSeconds,

      score:
        totalScore,

      percentage,

      correct,

      wrong,

      skipped,

      attempted,

      accuracy,

      status:
        "Completed",
    })
    .eq("id", attemptId);

  if (updateAttemptError) {
    console.error(
      "UPDATE TEST ATTEMPT ERROR:",
      updateAttemptError
    );

    throw updateAttemptError;
  }

  // -----------------------------------------------------
  // RETURN RESULT
  // -----------------------------------------------------

  return {
    success: true,

    attemptId,

    score:
      totalScore,

    totalMarks,

    percentage,

    correct,

    wrong,

    skipped,

    attempted,

    totalQuestions:
      attempt.tests.total_questions,

    accuracy,

    durationSeconds,

    submittedAt:
      submittedAt.toISOString(),
  };
}
