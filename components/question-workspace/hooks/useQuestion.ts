"use client";

import { useContext } from "react";

import { QuestionContext } from "../context/QuestionContext";

export function useQuestion() {
  const context = useContext(QuestionContext);

  if (!context) {
    throw new Error(
      "useQuestion must be used inside QuestionProvider."
    );
  }

  return context;
}