import type { QuestionBank } from "@/types/question-bank";

import {
  QuestionSchema,
} from "@/lib/validations/question";

const VALID_ANSWERS = [
  "A",
  "B",
  "C",
  "D",
  "E",
] as const;

const VALID_STATUS = [
  "Draft",
  "AI Generated",
  "Reviewed",
  "Approved",
  "Archived",
] as const;

export function mapQuestionFormData(
  formData: FormData
): QuestionBank {

  const correctAnswer =
    formData.get("correct_answer");

  const status =
    formData.get("status");

  return {

    // ==========================================
    // Academic Hierarchy
    // ==========================================

    subject_id: Number(
      formData.get("subject_id")
    ),

    chapter_id: Number(
      formData.get("chapter_id")
    ),

    topic_id: Number(
      formData.get("topic_id")
    ),

    difficulty_level_id: Number(
      formData.get("difficulty_level_id")
    ),

    bloom_level_id: Number(
      formData.get("bloom_level_id")
    ),

    question_type_id: Number(
      formData.get("question_type_id")
    ),

    // ==========================================
    // Question
    // ==========================================

    question_text: String(
      formData.get("question_text")
    ),

    question_image_url:
      formData.get("question_image_url")?.toString() ??
      null,

    option_a:
      formData.get("option_a")?.toString() ??
      null,

    option_b:
      formData.get("option_b")?.toString() ??
      null,

    option_c:
      formData.get("option_c")?.toString() ??
      null,

    option_d:
      formData.get("option_d")?.toString() ??
      null,

    option_e:
      formData.get("option_e")?.toString() ??
      null,

    correct_answer:
      VALID_ANSWERS.includes(
        correctAnswer as (typeof VALID_ANSWERS)[number]
      )
        ? (correctAnswer as QuestionBank["correct_answer"])
        : null,

    // ==========================================
    // Learning Support
    // ==========================================

    answer_key:
      formData.get("answer_key")?.toString() ??
      null,

    explanation:
      formData.get("explanation")?.toString() ??
      null,

    hint:
      formData.get("hint")?.toString() ??
      null,

    learning_objective:
      formData
        .get("learning_objective")
        ?.toString() ??
      null,

    // ==========================================
    // Assessment
    // ==========================================

    marks: Number(
      formData.get("marks") ?? 4
    ),

    negative_marks: Number(
      formData.get("negative_marks") ?? 1
    ),

    estimated_time_seconds: Number(
      formData.get("estimated_time_seconds") ?? 90
    ),

    // ==========================================
    // Source
    // ==========================================

    source_type:
      formData.get("source_type")?.toString() ??
      "Teacher",

    source_reference:
      formData.get("source_reference")?.toString() ??
      null,

    academic_year:
      formData.get("academic_year")?.toString() ??
      null,

    // ==========================================
    // Search
    // ==========================================

    tags:
      formData.get("tags")?.toString() ??
      null,

    keywords:
      formData.get("keywords")?.toString() ??
      null,

    // ==========================================
    // AI Metadata
    // ==========================================

    generated_by:
      formData.get("generated_by")?.toString() ??
      "Teacher",

    ai_model:
      formData.get("ai_model")?.toString() ??
      null,

    generation_prompt:
      formData
        .get("generation_prompt")
        ?.toString() ??
      null,

    // ==========================================
    // Workflow
    // ==========================================

    status:
      VALID_STATUS.includes(
        status as (typeof VALID_STATUS)[number]
      )
        ? (status as QuestionBank["status"])
        : "Draft",

    is_active:
      formData.get("is_active") === "true",
  };
}

export function getValidatedQuestion(
  formData: FormData
) {
  return QuestionSchema.parse(
    mapQuestionFormData(formData)
  );
}