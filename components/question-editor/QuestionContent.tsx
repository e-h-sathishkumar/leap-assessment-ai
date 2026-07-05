"use client";

import { useGeneratedQuestions } from "@/hooks/useGeneratedQuestions";

export default function QuestionContent() {
  const {
    questions,
    setQuestions,
    selectedQuestion,
    setSelectedQuestion,
  } = useGeneratedQuestions();

  function updateQuestion(value: string) {
    if (!selectedQuestion) return;

    const updatedQuestion = {
      ...selectedQuestion,
      question: value,
      status: "Edited" as const,
    };

    const updatedQuestions = questions.map((q) =>
      q.id === updatedQuestion.id ? updatedQuestion : q
    );

    setQuestions(updatedQuestions);
    setSelectedQuestion(updatedQuestion);
  }

  if (!selectedQuestion) {
    return (
      <div className="rounded-xl border bg-white p-10 shadow-sm text-center">
        <h2 className="text-xl font-semibold">
          Question Editor
        </h2>

        <p className="mt-4 text-gray-500">
          Select a generated question from the grid.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-xl font-semibold">
          Question Editor
        </h2>

        <span className="rounded-full bg-orange-100 px-3 py-1 text-sm text-orange-700">
          {selectedQuestion.status}
        </span>

      </div>

      <div>

        <label className="mb-2 block text-sm font-medium">
          Question Statement
        </label>

        <textarea
          rows={8}
          value={selectedQuestion.question}
          onChange={(e) => updateQuestion(e.target.value)}
          className="w-full rounded-lg border p-4 text-base focus:border-blue-500 focus:outline-none"
        />

      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">

        <button className="rounded-lg border p-3 hover:bg-gray-100">
          📷 Image
        </button>

        <button className="rounded-lg border p-3 hover:bg-gray-100">
          ∑ Equation
        </button>

        <button className="rounded-lg border p-3 hover:bg-gray-100">
          🤖 AI Improve
        </button>

        <button className="rounded-lg border p-3 hover:bg-gray-100">
          🌐 Translate
        </button>

      </div>

    </div>
  );
}