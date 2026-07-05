"use client";

import { useState } from "react";
import { useGeneratedQuestions } from "@/hooks/useGeneratedQuestions";

export default function AIReview() {

  const { selectedQuestion } =
    useGeneratedQuestions();

  const [loading, setLoading] =
    useState(false);

  const [review, setReview] =
    useState<any>(null);

  if (!selectedQuestion) return null;

  async function reviewQuestion() {

    setLoading(true);

    try {

      const response = await fetch(
        "/api/ai/review-question",
        {
          method: "POST",

          headers: {
            "Content-Type":"application/json",
          },

          body: JSON.stringify(selectedQuestion),
        }
      );

      const data = await response.json();

      setReview(data);

    } finally {

      setLoading(false);

    }

  }

  return (

    <div className="rounded-xl border bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between">

        <h2 className="text-xl font-semibold">
          AI Review
        </h2>

        <button
          onClick={reviewQuestion}
          className="rounded-lg bg-indigo-600 px-5 py-3 text-white"
        >
          {loading ? "Reviewing..." : "✨ AI Review"}
        </button>

      </div>

      {review && (

        <div className="mt-6 space-y-3">

          <p>
            Grammar :
            <strong> {review.grammar}</strong>
          </p>

          <p>
            Correct Answer :
            <strong> {review.correctAnswer}</strong>
          </p>

          <p>
            Difficulty :
            <strong> {review.difficulty}</strong>
          </p>

          <p>
            Blueprint :
            <strong> {review.blueprint}</strong>
          </p>

          <p>
            Duplicate :
            <strong> {review.duplicate}</strong>
          </p>

          <p className="text-lg font-bold text-green-600">
            Quality Score : {review.qualityScore}/100
          </p>

          <div className="rounded-lg bg-gray-50 p-4">

            <h3 className="font-semibold">
              Suggestions
            </h3>

            <ul className="mt-3 list-disc pl-6">

              {review.suggestions?.map(
                (s: string, index: number) => (
                  <li key={index}>
                    {s}
                  </li>
                )
              )}

            </ul>

          </div>

        </div>

      )}

    </div>

  );
}