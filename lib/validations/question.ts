import { z } from "zod";

export const QuestionSchema = z.object({
  subject_id: z.number().positive(),

  chapter_id: z.number().positive(),

  topic_id: z.number().positive(),

  difficulty_level_id: z.number().positive(),

  bloom_level_id: z.number().positive(),

  question_type_id: z.number().positive(),

  question_text: z.string().min(10),

  option_a: z.string().optional(),

  option_b: z.string().optional(),

  option_c: z.string().optional(),

  option_d: z.string().optional(),

  correct_answer: z
    .enum(["A", "B", "C", "D"])
    .optional(),

  answer_key: z.string().optional(),

  explanation: z.string().optional(),

  hint: z.string().optional(),

  learning_objective: z.string().optional(),

  marks: z.number().default(4),

  negative_marks: z.number().default(1),

  estimated_time_seconds: z.number().default(90),

  source_type: z.string().default("Teacher"),

  source_reference: z.string().optional(),

  academic_year: z.string().optional(),

  tags: z.string().optional(),

  keywords: z.string().optional(),

  generated_by: z.string().default("Teacher"),

  ai_model: z.string().optional(),

  generation_prompt: z.string().optional(),

  status: z
    .enum([
      "Draft",
      "AI Generated",
      "Reviewed",
      "Approved",
      "Archived",
    ])
    .default("Draft"),

  is_active: z.boolean().default(true),
});

export type QuestionInput =
  z.infer<typeof QuestionSchema>;