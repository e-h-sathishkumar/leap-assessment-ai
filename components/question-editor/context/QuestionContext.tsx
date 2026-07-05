"use client";

import { createContext } from "react";
import { Question } from "@/types/question";

export interface QuestionContextType {
  question: Question;
  setQuestion: React.Dispatch<React.SetStateAction<Question>>;
}

export const QuestionContext =
  createContext<QuestionContextType | null>(null);