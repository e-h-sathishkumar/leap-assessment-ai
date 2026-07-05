"use client";

import { useContext } from "react";
import { QuestionContext } from "@/components/question-editor/context/QuestionContext";

export function useQuestionEditor() {
  const context = useContext(QuestionContext);

  if (!context) {
    throw new Error(
      "useQuestionEditor must be used inside QuestionProvider"
    );
  }

  return context;
}