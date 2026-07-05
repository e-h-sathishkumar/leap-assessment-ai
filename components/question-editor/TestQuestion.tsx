"use client";

import { useState } from "react";
import { useGeneratedQuestions } from "@/hooks/useGeneratedQuestions";

export default function TestQuestion() {
  const { selectedQuestion } = useGeneratedQuestions();

  const [selectedOption, setSelectedOption] =
    useState("");

  const [submitted, setSubmitted] =
    useState(false);

  if (!selectedQuestion) return null;

  const options =
    selectedQuestion.options ?? [];

  const isCorrect =
    selectedOption ===
    selectedQuestion.correctAnswer;

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">

      <h2 className="text-xl font-semibold">
        🧪 Test Question
      </h2>

      <p className="mt-6 text-lg">
        {selectedQuestion.question}
      </p>

      <div className="mt-6 space-y-3">

        {options.map(
          (option: string, index: number) => {
            const label = String.fromCharCode(
              65 + index
            );

            return (
              <label
                key={label}
                className="flex cursor-pointer items-center gap-3 rounded-lg border p-4 hover:bg-gray-50"
              >
                <input
                  type="radio"
                  name="answer"
                  value={label}
                  checked={
                    selectedOption === label
                  }
                  onChange={() =>
                    setSelectedOption(label)
                  }
                />

                <span>
                  <strong>{label}.</strong>{" "}
                  {option}
                </span>
              </label>
            );
          }
        )}

      </div>

      {!submitted ? (

        <button
          onClick={() =>
            setSubmitted(true)
          }
          disabled={!selectedOption}
          className="mt-8 rounded-lg bg-blue-600 px-6 py-3 text-white"
        >
          Submit Answer
        </button>

      ) : (

        <div className="mt-8 rounded-lg border p-5">

          <h3 className="font-semibold">

            {isCorrect
              ? "✅ Correct"
              : "❌ Incorrect"}

          </h3>

          <p className="mt-3">

            Correct Answer :

            <strong>
              {" "}
              {
                selectedQuestion.correctAnswer
              }
            </strong>

          </p>

          <div className="mt-5 rounded-lg bg-gray-50 p-4">

            <h4 className="font-semibold">
              Explanation
            </h4>

            <p className="mt-2">
              {
                selectedQuestion.explanation
              }
            </p>

          </div>

        </div>

      )}

    </div>
  );
}