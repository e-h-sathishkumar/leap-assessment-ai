export interface QuestionBank {
  id?: number;

  // ==========================================
  // Academic Hierarchy
  // ==========================================

  subject_id: number;
  chapter_id: number;
  topic_id: number;

  difficulty_level_id: number;
  bloom_level_id: number;
  question_type_id: number;

  // ==========================================
  // Question
  // ==========================================

  question_text: string;

  question_image_url?: string | null;

  option_a?: string | null;
  option_b?: string | null;
  option_c?: string | null;
  option_d?: string | null;
  option_e?: string | null;

  correct_answer?:
    | "A"
    | "B"
    | "C"
    | "D"
    | "E"
    | null;

  // ==========================================
  // Learning Support
  // ==========================================

  answer_key?: string | null;

  explanation?: string | null;

  hint?: string | null;

  learning_objective?: string | null;

  // ==========================================
  // Assessment
  // ==========================================

  marks?: number;

  negative_marks?: number;

  estimated_time_seconds?: number;

  // ==========================================
  // Source
  // ==========================================

  source_type?: string | null;

  source_reference?: string | null;

  academic_year?: string | null;

  // ==========================================
  // Search
  // ==========================================

  tags?: string | null;

  keywords?: string | null;

  // ==========================================
  // AI Metadata
  // ==========================================

  generated_by?: string | null;

  ai_model?: string | null;

  generation_prompt?: string | null;

  // ==========================================
  // Workflow
  // ==========================================

  status?:
    | "Draft"
    | "AI Generated"
    | "Reviewed"
    | "Approved"
    | "Archived";

  is_active?: boolean;

  // ==========================================
  // Audit
  // ==========================================

  created_by?: string | null;

  created_at?: string;

  updated_at?: string;

  // ==========================================
  // Related Entities (Supabase Joins)
  // ==========================================

  subjects?: {
    id?: number;
    name: string;
    code?: string;
  };

  chapters?: {
    id?: number;
    name: string;
    code?: string;
  };

  topics?: {
    id?: number;
    name: string;
    code?: string;
  };

  difficulty_levels?: {
    id?: number;
    name: string;
  };

  bloom_levels?: {
    id?: number;
    name: string;
  };

  question_types?: {
    id?: number;
    name: string;
  };
}