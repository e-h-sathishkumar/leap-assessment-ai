"use client";

import { useGeneratedQuestions } from "@/hooks/useGeneratedQuestions";

export default function QuestionContent() {
  const {
    selectedQuestion,
    updateQuestion,
  } = useGeneratedQuestions();

  function updateQuestionText(
    value: string
  ) {
    if (!selectedQuestion) return;

    updateQuestion({
      ...selectedQuestion,
      question: value,
      status: "Edited",
    });
  }

  if (!selectedQuestion) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
        <h2 className="text-xl font-semibold">
          Question Editor
        </h2>

        <p className="mt-4 text-gray-500">
          Select a generated question
          from the grid.
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
          value={
            selectedQuestion.question
          }
          onChange={(event) =>
            updateQuestionText(
              event.target.value
            )
          }
          className="w-full rounded-lg border p-4 text-base focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">

        <button
          type="button"
          className="rounded-lg border p-3 hover:bg-gray-100"
        >
          📷 Image
        </button>

        <button
          type="button"
          className="rounded-lg border p-3 hover:bg-gray-100"
        >
          ∑ Equation
        </button>

        <button
          type="button"
          className="rounded-lg border p-3 hover:bg-gray-100"
        >
          🤖 AI Improve
        </button>

        <button
          type="button"
          className="rounded-lg border p-3 hover:bg-gray-100"
        >
          📝 Notes
        </button>

      </div>

    </div>
  );
}