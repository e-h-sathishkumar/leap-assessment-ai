// ====================================================
// File      : question.ts
// Module    : Repository
// Purpose   : Master Question Model
// Used By   : Repository, Assessment, CBT, AI
// ====================================================

export type QuestionSource =
  | "Manual"
  | "AI"
  | "Repository"
  | "PDF"
  | "DOCX"
  | "PPT"
  | "Image";

export type QuestionType =
  | "MCQ"
  | "MSQ"
  | "TrueFalse"
  | "AssertionReason"
  | "CaseStudy"
  | "Integer"
  | "Numerical"
  | "ShortAnswer"
  | "LongAnswer";

export type Difficulty =
  | "Easy"
  | "Medium"
  | "Hard";

export type BloomLevel =
  | "Remember"
  | "Understand"
  | "Apply"
  | "Analyze"
  | "Evaluate"
  | "Create";

export type QuestionStatus =
  | "Draft"
  | "Review"
  | "Published"
  | "Archived";

export interface QuestionOption {
  id: string;
  text: string;
  image_url?: string;
  is_correct: boolean;
}

export interface Question {

  id?: number;

  subject_id: number;
  chapter_id: number;
  topic_id: number;

  question: string;

  question_type: QuestionType;

  options?: QuestionOption[];

  correct_answer?: string;

  explanation?: string;

  hint?: string;

  learning_objective?: string;

  bloom_level?: BloomLevel;

  difficulty?: Difficulty;

  marks: number;

  negative_marks: number;

  estimated_time_seconds?: number;

  question_image_url?: string;

  solution_image_url?: string;

  source_type: QuestionSource;

  source_reference?: string;

  academic_year?: string;

  generated_by?: string;

  ai_model?: string;

  generation_prompt?: string;

  tags?: string[];

  keywords?: string[];

  status?: QuestionStatus;

  is_active?: boolean;

  created_at?: string;

  updated_at?: string;
}