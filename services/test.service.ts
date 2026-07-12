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

export async function getTestById(
  id: number
) {
  const { data, error } = await supabase
    .from("tests")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data as Test;
}

// -----------------------------------------------------
// Create Test
// -----------------------------------------------------

export async function createTest(
  test: Test
) {
  const { error } = await supabase
    .from("tests")
    .insert(test);

  if (error) throw error;
}

// -----------------------------------------------------
// Update Test
// -----------------------------------------------------

export async function updateTest(
  id: number,
  test: Partial<Test>
) {
  const { error } = await supabase
    .from("tests")
    .update(test)
    .eq("id", id);

  if (error) throw error;
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
// Create Test + Return Test
// -----------------------------------------------------

export async function createTestWithQuestions(
  form: CreateTestForm,
  questions: AIQuestion[]
) {

  console.log("========== FORM ==========");
  console.dir(form, { depth: null }); 
  console.log("======================================");

  console.log("subjectId =", form.subjectId);
console.log("subjectIds =", form.subjectIds);

console.log("chapterId =", form.chapterId);
console.log("chapterIds =", form.chapterIds);

console.log("topicId =", form.topicId);
console.log("topicIds =", form.topicIds);

  console.log("========== QUESTIONS ==========");
  console.log(questions.length);

  const payload = {
    title: form.title,

    exam: form.examType,
subject_id: form.subjectIds[0] ?? null,

chapter_id: form.chapterIds[0] ?? null,

topic_id: form.topicIds[0] ?? null,

    description: form.description,

    difficulty: form.difficulty,

    duration_minutes: form.duration,

    total_questions: questions.length,

    total_marks: form.maximumMarks,

    negative_marks: form.negativeMarks,

    question_type: "MCQ",

    test_type: "AI Generated",

    status: "Draft",

    is_active: true,
  };

  console.log("========== PAYLOAD ==========");
  console.dir(payload, { depth: null });

 console.log("===== INSERT TEST =====");

const { data: test, error } = await supabase
  .from("tests")
  .insert(payload)
  .select()
  .single();

if (error) {
  console.error("TEST INSERT ERROR");
  console.dir(error, { depth: null });
  throw error;
}

console.log("TEST CREATED");
console.dir(test, { depth: null });

  console.log("========== TEST CREATED ==========");
console.dir(test, { depth: null });

// Save AI generated questions
console.log("===== SAVING QUESTIONS =====");
console.log("===== STEP 2 : CALLING saveQuestions =====");
console.log("Questions Received:", questions.length);
console.dir(questions, { depth: null });
console.log("========== FORM ==========");
console.dir(form, { depth: null });

console.log("Subject IDs:", form.subjectIds);
console.log("Chapter IDs:", form.chapterIds);
console.log("Topic IDs:", form.topicIds);
console.log("========== FORM ==========");
console.dir(form, { depth: null });

console.log("Subject IDs:", form.subjectIds);
console.log("Chapter IDs:", form.chapterIds);
console.log("Topic IDs:", form.topicIds);
console.log("========== FORM ==========");
console.dir(form, { depth: null }); 
const savedQuestions =
  await saveQuestions(
    questions,
    form
  );
console.log("========== SAVED QUESTIONS ==========");
console.dir(savedQuestions, { depth: null });

console.log("===== STEP 3 : saveQuestions Returned =====");
console.dir(savedQuestions, { depth: null });
console.log("QUESTIONS SAVED");
console.dir(savedQuestions, { depth: null });

// Link questions to this test
console.log("===== LINKING QUESTIONS =====");
console.log("===== LINKING QUESTIONS =====");

await addQuestionsToTest(
  test.id,
  savedQuestions
);await addQuestionsToTest(
  test.id,
  savedQuestions
);

console.log("QUESTIONS LINKED");
return test;

}// -----------------------------------------------------
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
  const rows = questions.map((question, index) => ({
    test_id: testId,
    question_id: question.id,
    question_order: index + 1,
    marks: question.marks,
    negative_marks: question.negative_marks,
  }));
console.log("========== TEST QUESTION ROWS ==========");
console.dir(rows, { depth: null });
  const { error } = await supabase
    .from("test_questions")
    .insert(rows);

  if (error) {
  console.error("========== LINK ERROR ==========");
  console.dir(error, { depth: null });

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