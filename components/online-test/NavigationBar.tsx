"use client";

import { useState } from "react";

interface Props {
  currentQuestion: number;
  totalQuestions: number;
  attemptId?: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit?: () => Promise<void>;
}

export default function NavigationBar({
  currentQuestion,
  totalQuestions,
  attemptId,
  onPrevious,
  onNext,
  onSubmit,
}: Props) {
  const [submitting, setSubmitting] =
    useState(false);

  async function handleSubmit() {
    if (!onSubmit) return;

    const confirmed = window.confirm(
      "Are you sure you want to submit the test?\n\nYou will not be able to change your answers after submission."
    );

    if (!confirmed) return;

    try {
      setSubmitting(true);
      await onSubmit();
    } catch (error) {
      console.error(error);
      alert("Failed to submit the test.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-6 flex items-center justify-between rounded-xl border bg-white p-5 shadow-sm">

      {/* Previous Button */}
      <button
        onClick={onPrevious}
        disabled={currentQuestion === 0}
        className="rounded-lg border px-6 py-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Previous
      </button>

      {/* Question Counter */}
      <div className="text-sm font-medium text-slate-600">
        Question {currentQuestion + 1} of {totalQuestions}
      </div>

      {/* Right Side Buttons */}
      <div className="flex gap-3">

        <button
          onClick={onNext}
          disabled={currentQuestion === totalQuestions - 1}
          className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="rounded-lg bg-green-600 px-6 py-2 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Test"}
        </button>

      </div>

    </div>
  );
}