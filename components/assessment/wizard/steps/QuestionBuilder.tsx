"use client";

import AIGenerator from "@/components/question-workspace/ai/AIGenerator";
import type { CreateTestForm } from "@/types/test";

interface AIQuestionStudioProps {
  form: CreateTestForm;
}

export default function AIQuestionStudio({
  form,
}: AIQuestionStudioProps) {
  return (
    <AIGenerator
      form={form}
    />
  );
}