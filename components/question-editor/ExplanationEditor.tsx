"use client";

import { useGeneratedQuestions } from "@/hooks/useGeneratedQuestions";

export default function ExplanationEditor() {
  const {
    questions,
    setQuestions,
    selectedQuestion,
    setSelectedQuestion,
  } = useGeneratedQuestions();

  if (!selectedQuestion) return null;

  function updateExplanation(value: string) {
    const updatedQuestion = {
      ...selectedQuestion,
      explanation: value,
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
        Explanation
      </h2>

      <textarea
        rows={6}
        value={selectedQuestion.explanation ?? ""}
        onChange={(e) => updateExplanation(e.target.value)}
        className="w-full rounded-lg border p-4"
      />

      <div className="mt-5 flex gap-3">

        <button className="rounded-lg border px-4 py-2">
          🤖 Improve Explanation
        </button>

        <button className="rounded-lg border px-4 py-2">
          Shorten
        </button>

        <button className="rounded-lg border px-4 py-2">
          Expand
        </button>

      </div>

    </div>
  );
}