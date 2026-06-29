import { z } from "zod";

export const ChapterSchema = z.object({
  subject_id: z.coerce
    .number()
    .min(1, "Subject is required."),

  name: z
    .string()
    .trim()
    .min(1, "Chapter name is required.")
    .max(100),

  code: z
    .string()
    .trim()
    .min(1, "Chapter code is required.")
    .max(20),

  description: z
    .string()
    .trim()
    .optional(),
});

export type ChapterInput = z.infer<
  typeof ChapterSchema
>;