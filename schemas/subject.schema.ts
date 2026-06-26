import { z } from "zod";

export const subjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Subject name must be at least 2 characters")
    .max(100, "Subject name is too long"),

  code: z
    .string()
    .trim()
    .min(2, "Subject code is required")
    .max(20, "Subject code is too long")
    .transform((value) => value.toUpperCase()),

  description: z
    .string()
    .trim()
    .max(500, "Description is too long")
    .optional()
    .or(z.literal("")),

  is_active: z.boolean().default(true),
});

export type SubjectFormValues = z.infer<typeof subjectSchema>;