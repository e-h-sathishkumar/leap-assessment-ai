"use client";

import { useState } from "react";

interface Props {
  currentQuestion: number;
  totalQuestions: number;
  attemptId?: number;

  onPrevious: () => void;
  onNext: () => void;

  onMarkForReview?: () => void;
  onClearResponse?: () => void;

  onSubmit?: () => Promise<void>;
}

export default function NavigationBar({
  currentQuestion,
  totalQuestions,
  attemptId,
  onPrevious,
  onNext,
  onMarkForReview,
  onClearResponse,
  onSubmit,
}: Props) {
  const [submitting, setSubmitting] =
    useState(false);

  async function handleSubmit() {
    if (!onSubmit) return;

    const confirmed =
      window.confirm(
        "Are you sure you want to submit the test?\n\nYou will not be able to change your answers after submission."
      );

    if (!confirmed) return;

    try {
      setSubmitting(true);

      await onSubmit();

    } catch (error) {
      console.error(error);

      alert(
        "Failed to submit the test."
      );

    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-5">

      {/* Previous */}

      <button
        type="button"
        onClick={onPrevious}
        disabled={
          currentQuestion === 0
        }
        className="rounded-lg border px-6 py-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Previous
      </button>

      {/* Question Counter */}

      <div className="text-sm font-medium text-slate-600">
        Question{" "}
        {currentQuestion + 1}{" "}
        of {totalQuestions}
      </div>

      {/* Actions */}

      <div className="flex flex-wrap gap-3">

        {/* Clear Response */}

        {onClearResponse && (
          <button
            type="button"
            onClick={
              onClearResponse
            }
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Clear Response
          </button>
        )}

        {/* Mark for Review */}

        {onMarkForReview && (
          <button
            type="button"
            onClick={
              onMarkForReview
            }
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
          >
            Mark for Review
          </button>
        )}

        {/* Next */}

        <button
          type="button"
          onClick={onNext}
          disabled={
            currentQuestion ===
            totalQuestions - 1
          }
          className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>

        {/* Submit */}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="rounded-lg bg-green-600 px-6 py-2 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting
            ? "Submitting..."
            : "Submit Test"}
        </button>

      </div>

    </div>
  );
}