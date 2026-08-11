"use client";

import { createContext } from "react";

export interface GeneratedQuestion {
  id: string;

  question: string;
  questionType: string;
  difficulty: string;
  category: string;

  options: string[];

  correctAnswer: string;
  explanation: string;

  status:
    | "Generated"
    | "Edited"
    | "Approved"
    | "Saved";
}

export interface GeneratedQuestionsContextType {
  questions: GeneratedQuestion[];

  setQuestions: React.Dispatch<
    React.SetStateAction<GeneratedQuestion[]>
  >;

  selectedQuestion:
    | GeneratedQuestion
    | null;

  setSelectedQuestion: React.Dispatch<
    React.SetStateAction<
      GeneratedQuestion | null
    >
  >;

  updateQuestion: (
    updatedQuestion: GeneratedQuestion
  ) => void;
}

export const GeneratedQuestionsContext =
  createContext<
    GeneratedQuestionsContextType | null
  >(null);