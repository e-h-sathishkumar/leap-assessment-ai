"use client";

import { useState } from "react";

import QuestionCard, {
  AIQuestion,
} from "@/components/question-workspace/ai/QuestionCard";

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

  const [reviewQuestions, setReviewQuestions] =
    useState<AIQuestion[]>(questions);

  const [saving, setSaving] =
    useState(false);

  const totalMarks =
    reviewQuestions.reduce(
      (sum, q) => sum + (q.marks ?? 4),
      0
    );

  const totalNegative =
    reviewQuestions.reduce(
      (sum, q) => sum + (q.negative_marks ?? 1),
      0
    );

  async function handleCreateTest() {

    if (reviewQuestions.length === 0) {

      alert("No questions selected.");

      return;

    }

    try {

      setSaving(true);

      await createTestWithQuestions(
        form,
        reviewQuestions
      );

      alert("✅ Test Created Successfully");

    } catch (error: any) {

      console.error(error);

      alert(
        error?.message ??
          "Unable to create test."
      );

    } finally {

      setSaving(false);

    }

  }

  return (

    <div className="space-y-6">

      <div className="rounded-xl border bg-white p-8 shadow-sm">

        <h2 className="text-3xl font-bold">
          Review Test
        </h2>

        <p className="mt-2 text-slate-500">
          Review AI-generated questions before creating the test.
        </p>

      </div>

      <div className="rounded-xl border bg-white p-6">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          <div>

            <p className="text-sm text-slate-500">
              Questions
            </p>

            <p className="text-2xl font-bold">
              {reviewQuestions.length}
            </p>

          </div>

          <div>

            <p className="text-sm text-slate-500">
              Total Marks
            </p>

            <p className="text-2xl font-bold">
              {totalMarks}
            </p>

          </div>

          <div>

            <p className="text-sm text-slate-500">
              Negative
            </p>

            <p className="text-2xl font-bold">
              {totalNegative}
            </p>

          </div>

          <div>

            <p className="text-sm text-slate-500">
              Time
            </p>

            <p className="text-2xl font-bold">
              {reviewQuestions.length} Min
            </p>

          </div>

        </div>

      </div>

      <div className="space-y-5">

        {reviewQuestions.map(
          (question, index) => (

            <QuestionCard

              key={question.id ?? index}

              index={index + 1}

              question={question}

              onUpdate={(updated) =>

                setReviewQuestions((prev) =>

                  prev.map((q, i) =>

                    i === index
                      ? updated
                      : q

                  )

                )

              }

            onDuplicate={() =>
  setReviewQuestions((prev) => {
    const copy = [...prev];

    copy.splice(index + 1, 0, {
      ...question,
      id: undefined,
    });

    return copy;
  })
}
              onDelete={() =>

                setReviewQuestions((prev) =>

                  prev.filter(
                    (_, i) =>
                      i !== index
                  )

                )

              }

            />

          )

        )}

      </div>

      <div className="flex justify-end">

        <button

          onClick={handleCreateTest}

          disabled={saving}

          className="rounded-lg bg-blue-600 px-8 py-3 text-white hover:bg-blue-700 disabled:opacity-50"

        >

          {saving

            ? "Creating Test..."

            : "💾 Save & Create Test"}

        </button>

      </div>

    </div>

  );

}