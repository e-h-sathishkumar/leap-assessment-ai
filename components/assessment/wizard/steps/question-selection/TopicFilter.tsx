"use client";

// ====================================================
// Component : TopicFilter
// Module    : Question Selection
// Purpose   : Filter Questions by Topic
// ====================================================

export default function TopicFilter() {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">
        Topic
      </h3>

      <select className="w-full rounded-md border border-slate-300 px-3 py-2">
        <option>Select Topic</option>
      </select>
    </div>
  );
}