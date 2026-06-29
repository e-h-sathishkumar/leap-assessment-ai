"use client";

import { createContext } from "react";

import type { QuestionBank } from "@/types/question-bank";

export interface QuestionContextType {
  question: Partial<QuestionBank>;

  updateQuestion: (
    data: Partial<QuestionBank>
  ) => void;

  resetQuestion: () => void;
}

export const QuestionContext =
  createContext<QuestionContextType | null>(
    null
  );