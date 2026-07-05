"use client";

export default function ChapterFilter() {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">
        Chapter
      </h3>

      <select
        disabled
        className="w-full rounded-md border px-3 py-2 bg-slate-100"
      >
        <option>
          Select Subject First
        </option>
      </select>
    </div>
  );
}