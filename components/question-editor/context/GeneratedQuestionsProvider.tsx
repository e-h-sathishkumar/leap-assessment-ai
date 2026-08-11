"use client";

import { useState } from "react";

import {
  GeneratedQuestionsContext,
  GeneratedQuestion,
} from "./GeneratedQuestionsContext";

interface Props {
  children: React.ReactNode;
}

export default function GeneratedQuestionsProvider({
  children,
}: Props) {
  const [questions, setQuestions] =
    useState<GeneratedQuestion[]>([]);

  const [
    selectedQuestion,
    setSelectedQuestion,
  ] =
    useState<GeneratedQuestion | null>(
      null
    );

  function updateQuestion(
    updatedQuestion: GeneratedQuestion
  ) {
    setQuestions((currentQuestions) =>
      currentQuestions.map((question) =>
        question.id === updatedQuestion.id
          ? updatedQuestion
          : question
      )
    );

    setSelectedQuestion(
      updatedQuestion
    );
  }

  return (
    <GeneratedQuestionsContext.Provider
      value={{
        questions,
        setQuestions,
        selectedQuestion,
        setSelectedQuestion,
        updateQuestion,
      }}
    >
      {children}
    </GeneratedQuestionsContext.Provider>
  );
}