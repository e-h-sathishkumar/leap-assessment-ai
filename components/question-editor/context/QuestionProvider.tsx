"use client";

import { useState } from "react";
import { Question } from "@/types/question";
import { QuestionContext } from "./QuestionContext";

interface Props {
  children: React.ReactNode;
}

const initialQuestion: Question = {
  subject_id: 0,
  chapter_id: 0,
  topic_id: 0,

  question: "",

  question_type: "MCQ",

  options: [],

  correct_answer: "",

  explanation: "",

  hint: "",

  learning_objective: "",

  difficulty: "Easy",

  bloom_level: "Remember",

  marks: 4,

  negative_marks: 1,

  source_type: "Manual",

  status: "Draft",

  is_active: true,
};

export default function QuestionProvider({
  children,
}: Props) {
  const [question, setQuestion] =
    useState<Question>(initialQuestion);

  return (
    <QuestionContext.Provider
      value={{
        question,
        setQuestion,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
}