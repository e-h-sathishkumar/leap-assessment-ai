"use client";

import { useGeneratedQuestions } from "@/hooks/useGeneratedQuestions";

export default function OptionEditor() {
  const {
    questions,
    setQuestions,
    selectedQuestion,
    setSelectedQuestion,
  } = useGeneratedQuestions();

  if (!selectedQuestion) {
    return null;
  }

  const options = selectedQuestion.options ?? ["", "", "", ""];

  function updateOption(index: number, value: string) {
    const newOptions = [...options];
    newOptions[index] = value;

    const updatedQuestion = {
      ...selectedQuestion,
      options: newOptions,
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
        Options
      </h2>

      <div className="space-y-4">

        {["A", "B", "C", "D"].map((label, index) => (

          <div key={label}>

            <label className="mb-2 block font-medium">
              Option {label}
            </label>

            <input
              value={options[index] || ""}
              onChange={(e) =>
                updateOption(index, e.target.value)
              }
              className="w-full rounded-lg border p-3"
            />

          </div>

        ))}

      </div>

    </div>
  );
}