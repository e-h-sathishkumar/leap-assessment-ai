"use client";

export default function QuestionToolbar() {
  return (
    <div className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm">

      <div>
        <h1 className="text-2xl font-bold">
          Question Editor
        </h1>

        <p className="text-sm text-gray-500">
          Create and manage repository questions
        </p>
      </div>

      <div className="flex gap-3">

        <button className="rounded-lg border px-4 py-2 hover:bg-gray-100">
          Preview
        </button>

        <button className="rounded-lg border px-4 py-2 hover:bg-gray-100">
          AI Improve
        </button>

        <button className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700">
          Save
        </button>

      </div>

    </div>
  );
}