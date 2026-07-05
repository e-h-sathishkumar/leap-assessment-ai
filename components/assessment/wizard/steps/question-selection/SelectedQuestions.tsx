"use client";

// ====================================================
// Component : SelectedQuestions
// Module    : Question Selection
// Purpose   : Selected Questions Summary
// ====================================================

export default function SelectedQuestions() {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between">

        <h3 className="text-lg font-semibold">
          Selected Questions
        </h3>

        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
          0 Selected
        </span>

      </div>

    </div>
  );
}