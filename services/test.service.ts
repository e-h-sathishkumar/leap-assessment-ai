import { supabase } from "@/lib/supabase";
import { saveQuestions } from "@/services/question/question.service";
import type {
  Test,
  TestWithSubject,
  CreateTestForm,
} from "@/types/test";

import type { AIQuestion } from "@/components/question-workspace/ai/QuestionCard";

// -----------------------------------------------------
// Get All Tests
// -----------------------------------------------------

export async function getTests() {
  const { data, error } = await supabase
    .from("tests")
    .select(`
      *,
      subjects(
        id,
        name
      )
    `)
    .order("created_at", {
      ascending: false,
    });

  if (error) throw error;

  return (data ?? []) as TestWithSubject[];
}

// -----------------------------------------------------
// Get Test By Id
// -----------------------------------------------------
export async function getPublishedTestById(
  id: string
) {
  const { data, error } = await supabase
    .from("tests")
    .select(`
      *,
      subjects(
        id,
        name
      ),
      test_questions(
        id,
        question_order,
        marks,
        negative_marks,
        questions(
          id,
          question_text,
          option_a,
          option_b,
          option_c,
          option_d,
          correct_answer,
          explanation
        )
      )
    `)
    .eq("id", id)
    .eq("status", "Published")
    .single();

  if (error) throw error;

  data.test_questions.sort(
    (a: any, b: any) =>
      a.question_order - b.question_order
  );

  return data;
}
// -----------------------------------------------------
// Get Test By Id (With Questions)
// -----------------------------------------------------
// -----------------------------------------------------
// Get Test By Id (Complete)
// -----------------------------------------------------
// -----------------------------------------------------
// Get Test By Id
// -----------------------------------------------------

export async function getTestById(id: number) {
  const { data, error } = await supabase
    .from("tests")
    .select(`
      *,
      subjects(
        id,
        name
      ),
      test_questions(
        id,
        question_order,
        marks,
        negative_marks,
        questions(
          *
        )
      )
    `)
    .eq("id", id)
    .single();

  if (error) throw error;

  data.test_questions?.sort(
    (a: any, b: any) =>
      a.question_order - b.question_order
  );

  return data;
}
// -----------------------------------------------------
// Build Test Payload
// -----------------------------------------------------

function buildTestPayload(
  form: CreateTestForm,
  totalQuestions: number
) 

{
  return {
    title: form.title,

    exam: form.examType,

    subject_id: form.subjectIds?.[0] ?? null,

    chapter_id: form.chapterIds?.[0] ?? null,

    topic_id: form.topicIds?.[0] ?? null,

    description: form.description,

    difficulty: form.difficulty,

    duration_minutes: form.duration,

    total_questions: totalQuestions,

    total_marks: form.maximumMarks,

    negative_marks: form.negativeMarks,

    question_type: form.questionType,

    test_type: form.testType,

    status: "Draft",

    is_active: true,
  };
}

// -----------------------------------------------------
// Create Test + Save Questions + Link Questions
// -----------------------------------------------------

export async function createTestWithQuestions(
  form: CreateTestForm,
  questions: AIQuestion[]
) {
  if (questions.length === 0) {
    throw new Error("No questions available.");
  }

  console.log("===== CREATING TEST =====");

  console.log("========== TEST FORM ==========");
  console.dir(form, { depth: null });

  console.log("Title :", form.title);
  console.log("Exam :", form.examType);
  console.log("Subject :", form.subjectIds);
  console.log("Chapter :", form.chapterIds);
  console.log("Topic :", form.topicIds);

  // STEP 1 : Create Test

  const payload = buildTestPayload(
    form,
    questions.length
  );

  const { data: test, error: testError } = await supabase
    .from("tests")
    .insert(payload)
    .select()
    .single();

  if (testError) {
    console.error(testError);
    throw testError;
  }

  console.log("✅ Test Created :", test.id);

  // STEP 2 : Save Questions

  const savedQuestions = await saveQuestions(
    questions,
    form
  );

  if (savedQuestions.length === 0) {
    throw new Error("Questions were not saved.");
  }

  console.log(
    `✅ ${savedQuestions.length} Questions Saved`
  );

  // STEP 3 : Link Questions

  await addQuestionsToTest(
    test.id,
    savedQuestions
  );

  console.log("✅ Questions Linked To Test");

  return test;
}
// -----------------------------------------------------
// Create Test From Saved Questions
// -----------------------------------------------------

export async function createTestFromSavedQuestions(
  form: CreateTestForm,
  questionIds: number[]
) {
  if (questionIds.length === 0) {
    throw new Error(
      "Please select at least one question."
    );
  }

  const { data: questions, error } = await supabase
    .from("questions")
    .select("id, marks, negative_marks")
    .in("id", questionIds);

  if (error) throw error;

  const payload = buildTestPayload(
    form,
    questions.length
  );

  const { data: test, error: testError } = await supabase
    .from("tests")
    .insert(payload)
    .select()
    .single();

  if (testError) throw testError;

  await addQuestionsToTest(
    test.id,
    questions
  );

  return test;
}

// -----------------------------------------------------
// Delete Test
// -----------------------------------------------------

export async function deleteTest(
  id: number
) {
  const { error } = await supabase
    .from("tests")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

// -----------------------------------------------------
// Add Questions To Test
// -----------------------------------------------------

export async function addQuestionsToTest(
  testId: number,
  questions: {
    id: number;
    marks: number;
    negative_marks: number;
  }[]
) {
  const rows = questions.map(
    (question, index) => ({
      test_id: testId,

      question_id: question.id,

      question_order: index + 1,

      marks: question.marks,

      negative_marks:
        question.negative_marks,
    })
  );

  const { error } = await supabase
    .from("test_questions")
    .insert(rows);

  if (error) {
    console.error(error);
    throw error;
  }

  return true;
}
// -----------------------------------------------------
// Publish Test
// -----------------------------------------------------

export async function publishTest(
  testId: number
) {
  const { error } = await supabase
    .from("tests")
    .update({
      status: "Published",
    })
    .eq("id", testId);

  if (error) throw error;

  return true;
}
// -----------------------------------------------------
// Get Saved Questions
// -----------------------------------------------------

export async function getSavedQuestions(
  subjectId?: number,
  chapterId?: number,
  topicId?: number
) {
  let query = supabase
    .from("questions")
    .select("*")
    .order("id", { ascending: false });

  if (subjectId) {
    query = query.eq("subject_id", subjectId);
  }

  if (chapterId) {
    query = query.eq("chapter_id", chapterId);
  }

  if (topicId) {
    query = query.eq("topic_id", topicId);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data ?? [];
}
export async function getPublishedTests() {
  const { data, error } = await supabase
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

  if (error) {
    throw error;
  }

  return data ?? [];
}
export async function createTestAttempt(
  testId: string,
  studentId: string
) {
  const { data, error } = await supabase
    .from("test_attempts")
    .insert({
      test_id: Number(testId),
      student_id: studentId,
      started_at: new Date().toISOString(),
      status: "In Progress",
    })
    .select()
    .single();

  console.log("Insert Data:", data);

  if (error) {
    console.error("========== SUPABASE ERROR ==========");
    console.error("Code:", error.code);
    console.error("Message:", error.message);
    console.error("Details:", error.details);
    console.error("Hint:", error.hint);
    console.error("====================================");

    throw error;
  }

  return data;
}
export async function getAttemptById(
  attemptId: string
) {
  const { data, error } = await supabase
    .from("test_attempts")
    .select(`
      *,
      tests(
        *,
        test_questions(
          question_order,
          marks,
          negative_marks,
          questions(
  *,
  chapters(
    id,
    name
  ),
  student_answers(*)
)
        )
      )
    `)
    .eq("id", attemptId)
    .single();

  if (error) throw error;

  data.tests.test_questions.sort(
    (a: any, b: any) =>
      a.question_order - b.question_order
  );

  let correct = 0;
  let wrong = 0;
  let skipped = 0;

  data.tests.test_questions.forEach((tq: any) => {
    const answer = tq.questions.student_answers.find(
      (a: any) => a.attempt_id === Number(attemptId)
    );

    if (!answer || !answer.selected_answer) {
      skipped++;
    } else if (answer.is_correct) {
      correct++;
    } else {
      wrong++;
    }
  });

  const attempted = correct + wrong;

  const accuracy =
    attempted > 0
      ? Number(
          ((correct / attempted) * 100).toFixed(2)
        )
      : 0;

  return {
    ...data,
    correct,
    wrong,
    skipped,
    attempted,
    accuracy,
  };
}
// =====================================================
// GET STUDENT TEST ATTEMPTS
// =====================================================

export async function getStudentTestAttempts(
  studentId: string
) {
  const { data, error } = await supabase
    .from("test_attempts")
    .select(`
      id,
      test_id,
      student_id,
      started_at,
      submitted_at,
      status,
      score,
      percentage,
      accuracy,
      correct,
      wrong,
      skipped,
      attempted
    `)
    .eq("student_id", studentId)
    .order("started_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "GET STUDENT ATTEMPTS ERROR:",
      error
    );

    throw error;
  }

  return data ?? [];
}
export async function submitAttempt(
  attemptId: number
) {
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
    throw attemptError;
  }

  if (!attempt) {
    throw new Error(
      "Test attempt was not found."
    );
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

  const updates: Promise<any>[] = [];

  let correct = 0;
  let wrong = 0;
  let skipped = 0;
  let totalScore = 0;

  for (
    const testQuestion of
    attempt.tests.test_questions
  ) {
    const questionId =
      Number(
        testQuestion.questions.id
      );

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

    const marks = isCorrect
      ? Number(testQuestion.marks)
      : -Number(
          testQuestion.negative_marks ?? 0
        );

    if (isCorrect) {
      correct++;
    } else {
      wrong++;
    }

    totalScore += marks;

    // ---------------------------------------------------
    // SAVE QUESTION RESULT
    // ---------------------------------------------------

    updates.push(
      supabase
        .from("student_answers")
        .update({
          is_correct: isCorrect,
          marks_obtained: marks,
        })
        .eq("id", answer.id)
    );
  }

  // -----------------------------------------------------
  // UPDATE STUDENT ANSWERS
  // -----------------------------------------------------

  const updateResults =
    await Promise.all(updates);

  for (
    const result of updateResults
  ) {
    if (result.error) {
      throw result.error;
    }
  }

  // -----------------------------------------------------
  // CALCULATE TOTAL MARKS
  // -----------------------------------------------------

  const totalMarks =
    attempt.tests.test_questions.reduce(
      (
        sum: number,
        question: any
      ) =>
        sum +
        Number(
          question.marks ?? 0
        ),
      0
    );

  // -----------------------------------------------------
  // CALCULATE SCORE PERCENTAGE
  // -----------------------------------------------------

  const percentage =
    totalMarks === 0
      ? 0
      : Math.max(
          0,
          Number(
            (
              (totalScore /
                totalMarks) *
              100
            ).toFixed(2)
          )
        );

  // -----------------------------------------------------
  // CALCULATE ACCURACY
  // -----------------------------------------------------

  const attempted =
    correct + wrong;

  const accuracy =
    attempted === 0
      ? 0
      : Number(
          (
            (correct /
              attempted) *
            100
          ).toFixed(2)
        );

  // -----------------------------------------------------
  // SUBMISSION TIME
  // -----------------------------------------------------

  const submittedAt =
    new Date();

  // -----------------------------------------------------
  // CALCULATE DURATION
  //
  // started_at is stored when the attempt is created.
  // duration_seconds = submitted_at - started_at
  // -----------------------------------------------------

  const startedAt =
    new Date(
      attempt.started_at
    );

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
  // UPDATE ATTEMPT
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