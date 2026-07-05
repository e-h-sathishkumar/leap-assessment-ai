"use client";
import { useState } from "react";

import type { AIQuestion } from "@/components/question-workspace/ai/QuestionCard";
import {
  createTestWithQuestions,
} from "@/services/test.service";

interface ReviewTestProps {
  questions: AIQuestion[];
  form: any;
}

export default function ReviewTest({
  questions,
  form,
}: ReviewTestProps) {
  const [saving, setSaving] = useState(false);

  async function handleCreateTest() {
    if (questions.length === 0) {
      alert("No questions selected.");
      return;
    }

    try {
      setSaving(true);

      
      await createTestWithQuestions(
  form,
  questions
);

alert("✅ Draft Saved Successfully");
    } catch (error: any) {
  console.error("========== CREATE TEST ERROR ==========");
  console.dir(error, { depth: null });

  alert(
    error?.message ??
    JSON.stringify(error) ??
    "Unable to create Test."
  );
}

  return (
    <div className="space-y-6">

      <div className="rounded-xl border bg-white p-8 shadow-sm">

        <h2 className="text-3xl font-bold">
          Review Test
        </h2>

        <p className="mt-2 text-slate-500">
          Review the test details before creating and publishing.
        </p>

      </div>

      <div className="rounded-xl border bg-white p-6">

        <h3 className="text-lg font-semibold">
          Total Questions
        </h3>

        <p className="mt-2 text-4xl font-bold text-blue-600">
          {questions.length}
        </p>

      </div>

      <div className="rounded-xl border bg-white p-6">

        <h3 className="mb-4 text-lg font-semibold">
          Test Summary
        </h3>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

          <div>
            <p className="text-sm text-slate-500">
              Questions
            </p>

            <p className="text-xl font-bold">
              {questions.length}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Total Marks
            </p>

            <p className="text-xl font-bold">
              {questions.reduce(
                (sum: number, q: any) =>
                  sum + (q.marks ?? 0),
                0
              )}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Negative Marks
            </p>

            <p className="text-xl font-bold">
              {questions.reduce(
                (sum: number, q: any) =>
                  sum + (q.negative_marks ?? 0),
                0
              )}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Estimated Time
            </p>

            <p className="text-xl font-bold">
              {questions.length} Minutes
            </p>
          </div>

        </div>

      </div>

      <div className="space-y-4">

        {questions.map((q: any, index: number) => (

          <div
            key={index}
            className="rounded-xl border bg-white p-5"
          >

            <div className="flex items-center justify-between">

              <h4 className="font-semibold">
                Question {index + 1}
              </h4>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                {q.difficulty}
              </span>

            </div>

            <p className="mt-4">
              {q.question}
            </p>

            <div className="mt-5 grid gap-2">

              <div>A. {q.options?.A}</div>
              <div>B. {q.options?.B}</div>
              <div>C. {q.options?.C}</div>
              <div>D. {q.options?.D}</div>

            </div>

            <div className="mt-5 rounded-lg bg-green-50 p-4">

              <strong>Answer:</strong>{" "}
              {q.correct_answer}

            </div>

          </div>

        ))}

      </div>

      <div className="flex justify-end">

        <button
          onClick={handleCreateTest}
          disabled={saving}
          className="rounded-lg bg-blue-600 px-8 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving
            ? "Saving Test..."
            : "Save Test"}
        </button>

      </div>

    </div>
  );
}
}