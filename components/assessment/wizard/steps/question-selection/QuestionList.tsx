"use client";

// ====================================================
// Component : QuestionList
// Module    : Question Selection
// Purpose   : Available Questions
// ====================================================

export default function QuestionList() {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">

      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Available Questions
        </h3>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">
          0 Questions
        </span>
      </div>

      <div className="rounded-lg border border-dashed p-10 text-center text-slate-500">
        Select a Subject, Chapter and Topic to load questions.
      </div>

    </div>
  );
}