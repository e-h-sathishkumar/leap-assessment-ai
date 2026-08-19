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

  console.log("âœ… Test Created :", test.id);

  // STEP 2 : Save Questions

  const savedQuestions = await saveQuestions(
    questions,
    form
  );

  if (savedQuestions.length === 0) {
    throw new Error("Questions were not saved.");
  }

  console.log(
    `âœ… ${savedQuestions.length} Questions Saved`
  );

  // STEP 3 : Link Questions

  await addQuestionsToTest(
    test.id,
    savedQuestions
  );

  console.log("âœ… Questions Linked To Test");

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
  // -----------------------------------------------------
  // VALIDATE ATTEMPT ID
  // -----------------------------------------------------

  const numericAttemptId = Number(attemptId);

  if (
    !Number.isInteger(numericAttemptId) ||
    numericAttemptId <= 0
  ) {
    console.error(
      "INVALID ATTEMPT ID:",
      attemptId
    );

    return null;
  }

  console.log(
    "========================================"
  );

  console.log(
    "GET ATTEMPT BY ID"
  );

  console.log(
    "Attempt ID:",
    numericAttemptId
  );

  console.log(
    "========================================"
  );

  // -----------------------------------------------------
  // IMPORTANT
  // Use the authenticated server Supabase client.
  //
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

    console.error(
      "Code:",
      attemptError.code
    );

    console.error(
      "Message:",
      attemptError.message
    );

    console.error(
      "Details:",
      attemptError.details
    );

    console.error(
      "Hint:",
      attemptError.hint
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

  console.log(
    "ATTEMPT FOUND:",
    attempt.id
  );

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
    console.error(
      "TEST NOT FOUND:",
      attempt.test_id
    );

    return {
      ...attempt,
      tests: null,
      correct: 0,
      wrong: 0,
      skipped: 0,
      attempted: 0,
      accuracy: 0,
    };
  }

  // -----------------------------------------------------
  // LOAD TEST QUESTIONS
  // -----------------------------------------------------

  const {
    data: testQuestions,
    error: testQuestionsError,
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
        )
      )
    `)
    .eq("test_id", Number(attempt.test_id))
    .order("question_order", {
      ascending: true,
    });

  if (testQuestionsError) {
    console.error(
      "LOAD TEST QUESTIONS ERROR:",
      testQuestionsError
    );

    throw testQuestionsError;
  }

  // -----------------------------------------------------
  // LOAD STUDENT ANSWERS
  // -----------------------------------------------------

  const {
    data: studentAnswers,
    error: studentAnswersError,
  } = await supabase
    .from("student_answers")
    .select("*")
    .eq("attempt_id", numericAttemptId);

  if (studentAnswersError) {
    console.error(
      "LOAD STUDENT ANSWERS ERROR:",
      studentAnswersError
    );

    throw studentAnswersError;
  }

  // -----------------------------------------------------
  // NORMALIZE QUESTIONS
  // -----------------------------------------------------

  const normalizedQuestions =
    (testQuestions ?? []).map(
      (testQuestion: any) => {
        const question =
          Array.isArray(
            testQuestion.questions
          )
            ? testQuestion.questions[0] ?? null
            : testQuestion.questions ?? null;

        const chapter =
          question
            ? Array.isArray(
                question.chapters
              )
              ? question.chapters[0] ?? null
              : question.chapters ?? null
            : null;

        return {
          ...testQuestion,

          questions: question
            ? {
                ...question,
                chapters: chapter,
                student_answers: [],
              }
            : null,
        };
      }
    );

  // -----------------------------------------------------
  // ATTACH STUDENT ANSWERS
  // -----------------------------------------------------

  const answers =
    studentAnswers ?? [];

  for (
    const testQuestion of
    normalizedQuestions
  ) {
    if (
      !testQuestion.questions
    ) {
      continue;
    }

    const questionId =
      Number(
        testQuestion.questions.id
      );

    testQuestion.questions.student_answers =
      answers.filter(
        (answer: any) =>
          Number(
            answer.question_id
          ) === questionId
      );
  }

  // -----------------------------------------------------
  // CALCULATE RESULT
  // -----------------------------------------------------

  let correct = 0;
  let wrong = 0;
  let skipped = 0;

  for (
    const testQuestion of
    normalizedQuestions
  ) {
    if (
      !testQuestion.questions
    ) {
      skipped++;
      continue;
    }

    const answer =
      testQuestion.questions.student_answers?.find(
        (studentAnswer: any) =>
          Number(
            studentAnswer.attempt_id
          ) === numericAttemptId
      );

    if (
      !answer ||
      !answer.selected_answer
    ) {
      skipped++;
    } else if (
      answer.is_correct === true
    ) {
      correct++;
    } else {
      wrong++;
    }
  }

  const attempted =
    correct + wrong;

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
  // RETURN COMPLETE ATTEMPT
  // -----------------------------------------------------

  return {
    ...attempt,

    tests: {
      ...test,

      test_questions:
        normalizedQuestions,
    },

    correct,
    wrong,
    skipped,
    attempted,
    accuracy,
  };
}


