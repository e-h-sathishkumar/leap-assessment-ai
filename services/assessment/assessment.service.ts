import { supabase } from "@/lib/supabase";

export async function createAssessment(
  assessment: any
) {
  const { data, error } = await supabase
    .from("assessments")
    .insert(assessment)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function addQuestionsToAssessment(
  assessmentId: number,
  questions: any[]
) {
  const rows = questions.map(
    (question: any, index: number) => ({
      assessment_id: assessmentId,
      question_id: question.id,
      question_order: index + 1,
      marks: question.marks,
      negative_marks: question.negative_marks,
    })
  );

  const { error } = await supabase
    .from("assessment_questions")
    .insert(rows);

  if (error) {
    throw error;
  }

  return true;
}