"use client";

import { useState } from "react";
import { useGeneratedQuestions } from "@/hooks/useGeneratedQuestions";

type Status = "Generated" | "Edited" | "Approved" | "Saved";

export default function GeneratedQuestionsGrid() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const {
    questions,
    selectedQuestion,
    setSelectedQuestion,
  } = useGeneratedQuestions();

  const activeId = selectedQuestion?.id;

  function toggle(id: number) {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  }

  function statusColor(status: Status) {
    switch (status) {
      case "Generated":
        return "bg-yellow-100 text-yellow-700";

      case "Edited":
        return "bg-orange-100 text-orange-700";

      case "Approved":
        return "bg-green-100 text-green-700";

      case "Saved":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  function difficultyColor(level: string) {
    switch (level) {
      case "Easy":
        return "bg-green-100 text-green-700";

      case "Medium":
        return "bg-yellow-100 text-yellow-700";

      case "Hard":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  return (
    <div className="rounded-xl border bg-white shadow-sm">

      {/* Header */}

      <div className="border-b p-5">

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-xl font-semibold">
              Generated Questions ({questions.length})
            </h2>

            <p className="text-sm text-gray-500">
              Review AI generated questions before saving.
            </p>

          </div>

          <div className="flex gap-2">

            <button className="rounded-lg border px-4 py-2">
              Generate Again
            </button>

            <button className="rounded-lg border px-4 py-2">
              Improve Selected
            </button>

            <button className="rounded-lg border px-4 py-2">
              Delete
            </button>

            <button className="rounded-lg bg-blue-600 px-5 py-2 text-white">
              Save Selected
            </button>

          </div>

        </div>

        <input
          placeholder="Search Questions..."
          className="mt-5 w-full rounded-lg border p-3"
        />

      </div>

      {/* Empty State */}

      {questions.length === 0 ? (

        <div className="p-12 text-center">

          <div className="text-6xl">
            🤖
          </div>

          <h3 className="mt-5 text-xl font-semibold">
            No Questions Generated
          </h3>

          <p className="mt-2 text-gray-500">
            Generate questions using AI Question Studio.
          </p>

        </div>

      ) : (

        <div className="divide-y">

          {questions.map((q: any) => (

            <div
              key={q.id}
              onClick={() => setSelectedQuestion(q)}
              className={`cursor-pointer p-5 transition hover:bg-gray-50 ${
                activeId === q.id
                  ? "border-l-4 border-blue-600 bg-blue-50"
                  : ""
              }`}
            >

              <div className="flex items-start justify-between">

                <div className="flex gap-4">

                  <input
                    type="checkbox"
                    checked={selectedIds.includes(q.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggle(q.id);
                    }}
                  />

                  <div>

                    <div className="flex flex-wrap gap-2">

                      <span className="font-semibold">
                        Q{q.id}
                      </span>

                      <span
                        className={`rounded-full px-2 py-1 text-xs ${difficultyColor(
                          q.difficulty
                        )}`}
                      >
                        {q.difficulty}
                      </span>

                      <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs text-indigo-700">
                        {q.category}
                      </span>

                      <span
                        className={`rounded-full px-2 py-1 text-xs ${statusColor(
                          q.status
                        )}`}
                      >
                        {q.status}
                      </span>

                    </div>

                    <p className="mt-3 line-clamp-2 text-gray-700">
                      {q.question}
                    </p>

                  </div>

                </div>

                <div className="flex gap-2">

                  <button
                    className="rounded border px-3 py-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedQuestion(q);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="rounded border px-3 py-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    AI Improve
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}