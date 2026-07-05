// ====================================================
// File      : question.repository.ts
// Module    : Question Repository
// Purpose   : Save AI Generated Questions
// ====================================================

import { supabase } from "@/lib/supabase";
import type { AIQuestion } from "@/components/question-workspace/ai/QuestionCard";

export interface SaveAIQuestionOptions {
  subjectId: number;
  chapterId: number;
  topicId: number;

  academicYear?: string;

  generatedBy?: string;

  aiModel?: string;

  generationPrompt?: string;
}

export async function saveAIQuestions(
  questions: AIQuestion[],
  options: SaveAIQuestionOptions
) {
  const payload = questions.map((question) => ({
    subject_id: options.subjectId,

    chapter_id: options.chapterId,

    topic_id: options.topicId,

    question: question.question,

    question_type: "MCQ",

    difficulty: question.difficulty ?? "Medium",

    marks: 4,

    negative_marks: 1,

    option_a: question.options.A,

    option_b: question.options.B,

    option_c: question.options.C,

    option_d: question.options.D,

    option_e: null,

    correct_answer: question.correct_answer,

    answer_key: question.correct_answer,

    explanation: question.explanation ?? null,

    hint: question.hint ?? null,

    learning_objective:
      question.learning_objective ?? null,

    estimated_time_seconds: 90,

    source_type: "AI",

    source_reference: "Gemini AI",

    academic_year:
      options.academicYear ?? null,

    tags: question.tags?.join(",") ?? null,

    keywords: question.tags?.join(",") ?? null,

    generated_by:
      options.generatedBy ?? "Gemini",

    ai_model:
      options.aiModel ??
      "Gemini 2.5 Flash",

    generation_prompt:
      options.generationPrompt ?? null,

    status: "Draft",

    is_active: true,
  }));

  const { data, error } = await supabase
    .from("questions")
    .insert(payload)
    .select();

  if (error) {
    throw error;
  }

  return data;
}