import { supabase } from "@/lib/supabase";

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

  return data;
}

export async function addQuestionsToTest(
  testId: number,
  questions: any[]
) {
  const rows = questions.map(
    (question: any, index: number) => ({
      test_id: testId,
      question_id: question.id,
      question_order: index + 1,
      marks: question.marks,
      negative_marks: question.negative_marks,
    })
  );

  const { error } = await supabase
    .from("test_questions")
    .insert(rows);

  if (error) throw error;

  return true;
}

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