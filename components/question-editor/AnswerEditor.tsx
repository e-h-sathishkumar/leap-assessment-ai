"use client";

import { useGeneratedQuestions } from "@/hooks/useGeneratedQuestions";

export default function AnswerEditor() {
  const {
    questions,
    setQuestions,
    selectedQuestion,
    setSelectedQuestion,
  } = useGeneratedQuestions();

  if (!selectedQuestion) {
    return null;
  }

  function updateAnswer(answer: string) {
    const updatedQuestion = {
      ...selectedQuestion,
      correctAnswer: answer,
      status: "Edited" as const,
    };

    setQuestions(
      questions.map((q) =>
        q.id === updatedQuestion.id ? updatedQuestion : q
      )
    );

    setSelectedQuestion(updatedQuestion);
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-semibold">
        Correct Answer
      </h2>

      <select
        value={selectedQuestion.correctAnswer ?? ""}
        onChange={(e) => updateAnswer(e.target.value)}
        className="w-full rounded-lg border p-3"
      >
        <option value="">Select Correct Answer</option>
        <option value="A">Option A</option>
        <option value="B">Option B</option>
        <option value="C">Option C</option>
        <option value="D">Option D</option>
      </select>

    </div>
  );
}