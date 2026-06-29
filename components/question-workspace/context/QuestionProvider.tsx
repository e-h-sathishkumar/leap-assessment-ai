"use client";

import { useState } from "react";
import type { ReactNode } from "react";

import { QuestionContext } from "./QuestionContext";

import type { QuestionBank } from "@/types/question-bank";

const defaultQuestion: Partial<QuestionBank> = {
  marks: 4,
  negative_marks: 1,
  estimated_time_seconds: 90,
  generated_by: "Teacher",
  source_type: "Teacher",
  status: "Draft",
  is_active: true,
};

export function QuestionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [question, setQuestion] =
    useState<Partial<QuestionBank>>(defaultQuestion);

  function updateQuestion(
    data: Partial<QuestionBank>
  ) {
    setQuestion((previous) => ({
      ...previous,
      ...data,
    }));
  }

  function resetQuestion() {
    setQuestion(defaultQuestion);
  }

  return (
    <QuestionContext.Provider
      value={{
        question,
        updateQuestion,
        resetQuestion,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
}