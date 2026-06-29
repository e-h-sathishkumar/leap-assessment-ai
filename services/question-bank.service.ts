import { supabase } from "@/lib/supabase";

import type { QuestionBank } from "@/types/question-bank";

export async function getQuestions() {
  const { data, error } = await supabase
    .from("questions")
    .select(`
      *,
      subjects(name),
      chapters(name),
      topics(name)
    `)
    .order("created_at", {
      ascending: false,
    });

  if (error) throw error;

  return (
    (data ?? []).map((q) => ({
      ...q,
      question_text: q.question,
    }))
  );
}

export async function getQuestionById(
  id: number
) {
  const { data, error } = await supabase
    .from("questions")
    .select(`
      *,
      subjects(name),
      chapters(name),
      topics(name)
    `)
    .eq("id", id)
    .single();

  if (error) throw error;

  if (!data) return null;

  return {
    ...data,
    question_text: data.question,
  };
}

export async function createQuestion(
  question: QuestionBank
) {
  const payload = {
    subject_id: question.subject_id,
    chapter_id: question.chapter_id,
    topic_id: question.topic_id,

    question: question.question_text,

    question_type:
      question.question_type_id?.toString() ??
      "MCQ",

    difficulty:
      question.difficulty_level_id?.toString() ??
      "Medium",

    question_image_url:
      question.question_image_url,

    option_a: question.option_a,
    option_b: question.option_b,
    option_c: question.option_c,
    option_d: question.option_d,
    option_e: question.option_e,

    correct_answer:
      question.correct_answer,

    answer_key:
      question.answer_key,

    explanation:
      question.explanation,

    hint:
      question.hint,

    learning_objective:
      question.learning_objective,

    marks:
      question.marks,

    negative_marks:
      question.negative_marks,

    estimated_time_seconds:
      question.estimated_time_seconds,

    source_type:
      question.source_type,

    source_reference:
      question.source_reference,

    academic_year:
      question.academic_year,

    tags:
      question.tags,

    keywords:
      question.keywords,

    generated_by:
      question.generated_by,

    ai_model:
      question.ai_model,

    generation_prompt:
      question.generation_prompt,

    status:
      question.status,

    is_active:
      question.is_active,
  };

  const { error } = await supabase
    .from("questions")
    .insert(payload);

  if (error) throw error;
}

export async function updateQuestion(
  id: number,
  question: Partial<QuestionBank>
) {
  const payload = {
    subject_id: question.subject_id,
    chapter_id: question.chapter_id,
    topic_id: question.topic_id,

    question: question.question_text,

    question_type:
      question.question_type_id?.toString(),

    difficulty:
      question.difficulty_level_id?.toString(),

    question_image_url:
      question.question_image_url,

    option_a: question.option_a,
    option_b: question.option_b,
    option_c: question.option_c,
    option_d: question.option_d,
    option_e: question.option_e,

    correct_answer:
      question.correct_answer,

    answer_key:
      question.answer_key,

    explanation:
      question.explanation,

    hint:
      question.hint,

    learning_objective:
      question.learning_objective,

    marks:
      question.marks,

    negative_marks:
      question.negative_marks,

    estimated_time_seconds:
      question.estimated_time_seconds,

    source_type:
      question.source_type,

    source_reference:
      question.source_reference,

    academic_year:
      question.academic_year,

    tags:
      question.tags,

    keywords:
      question.keywords,

    generated_by:
      question.generated_by,

    ai_model:
      question.ai_model,

    generation_prompt:
      question.generation_prompt,

    status:
      question.status,

    is_active:
      question.is_active,
  };

  const { error } = await supabase
    .from("questions")
    .update(payload)
    .eq("id", id);

  if (error) throw error;
}

export async function deleteQuestion(
  id: number
) {
  const { error } = await supabase
    .from("questions")
    .delete()
    .eq("id", id);

  if (error) throw error;
}