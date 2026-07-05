"use client";

import GeneratedQuestionsProvider from "@/components/question-editor/context/GeneratedQuestionsProvider";
import AIQuestionStudio from "./AIQuestionStudio";

export default function AIQuestion() {
  return (
    <GeneratedQuestionsProvider>
      <AIQuestionStudio />
    </GeneratedQuestionsProvider>
  );
}