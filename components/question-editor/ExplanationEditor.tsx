"use client";

import { useGeneratedQuestions } from "@/hooks/useGeneratedQuestions";

export default function ExplanationEditor() {
  const {
    selectedQuestion,
    updateQuestion,
  } = useGeneratedQuestions();

  if (!selectedQuestion) {
    return null;
  }

 function updateExplanation(value: string) {
  if (!selectedQuestion?.id) {
    return;
  }

  updateQuestion({
    ...selectedQuestion,
    id: selectedQuestion.id,
    explanation: value,
    status: "Edited",
  });
}
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-semibold">
        Explanation
      </h2>

      <textarea
        rows={6}
        value={
          selectedQuestion.explanation ??
          ""
        }
        onChange={(event) =>
          updateExplanation(
            event.target.value
          )
        }
        className="w-full rounded-lg border p-4"
      />

      <div className="mt-5 flex gap-3">

        <button
          type="button"
          className="rounded-lg border px-4 py-2"
        >
          🤖 Improve Explanation
        </button>

        <button
          type="button"
          className="rounded-lg border px-4 py-2"
        >
          Shorten
        </button>

        <button
          type="button"
          className="rounded-lg border px-4 py-2"
        >
          Expand
        </button>

      </div>

    </div>
  );
}