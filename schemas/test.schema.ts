import { z } from "zod";

export const TestSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Test title is required.")
    .max(200),

  exam: z.enum([
    "NEET",
    "JEE Main",
    "JEE Advanced",
    "CBSE",
  ]),

  subject_id: z
    .number()
    .positive("Subject is required."),

  duration_minutes: z
    .number()
    .positive("Duration must be greater than 0."),

  total_marks: z
    .number()
    .min(0),

  negative_marks: z
    .number()
    .min(0),

  instructions: z
    .string()
    .optional(),

  status: z.enum([
    "Draft",
    "Published",
    "Archived",
  ]),

  start_time: z
    .string()
    .nullable()
    .optional(),

  end_time: z
    .string()
    .nullable()
    .optional(),

  is_active: z.boolean(),
});

export type TestInput = z.infer<
  typeof TestSchema
>;