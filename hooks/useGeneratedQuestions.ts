"use client";

import { useContext } from "react";

import {
  GeneratedQuestionsContext,
} from "@/components/question-editor/context/GeneratedQuestionsContext";

export function useGeneratedQuestions() {
  const context =
    useContext(
      GeneratedQuestionsContext
    );

  if (!context) {
    throw new Error(
      "useGeneratedQuestions must be used inside GeneratedQuestionsProvider"
    );
  }

  return context;
}