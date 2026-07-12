"use client";

import type { CreateTestForm } from "@/types/test";
import type { AIQuestion } from "./QuestionCard";

import AIGeneratorForm from "./AIGeneratorForm";

interface AIGeneratorProps {
  form: CreateTestForm;

  onAddToTest?: (
    questions: AIQuestion[]
  ) => void;
}

export default function AIGenerator({
  form,
  onAddToTest,
}: AIGeneratorProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          🤖 AI Question Generator
        </h1>

        <p className="mt-2 text-slate-500">
          Generate AI-powered questions using the
          Assessment Wizard configuration.
        </p>
      </div>

      <AIGeneratorForm
        form={form}
        onAddToTest={onAddToTest}
      />
    </div>
  );
}