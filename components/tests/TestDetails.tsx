"use client";

import { useState } from "react";

import type { Test } from "@/types/test";

interface TestDetailsProps {
  test: Test;
}

export default function TestDetails({
  test,
}: TestDetailsProps) {
  const [publishing, setPublishing] =
    useState(false);

  async function handlePublish() {
    setPublishing(true);

    try {
      const response = await fetch(
        "/api/tests/publish",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            testId: test.id,
          }),
        }
      );

      const result =
        await response.json();

      alert(result.message);

      if (result.success) {
        location.reload();
      }
    } catch (error) {
      console.error(error);

      alert("Failed to publish.");
    } finally {
      setPublishing(false);
    }
  }

  return (
    <div className="space-y-8">

      <div className="rounded-xl border bg-white p-8 shadow">

        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-3xl font-bold">
              {test.title ||
                "Untitled Test"}
            </h1>

            <p className="mt-2 text-slate-500">
              {test.exam}
            </p>

          </div>

          <span className="rounded bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
            {test.status}
          </span>

        </div>

        <div className="mt-8 grid grid-cols-2 gap-6">

          <div>
            <strong>
              Duration
            </strong>

            <p>
              {test.duration_minutes}
              {" "}Minutes
            </p>
          </div>

          <div>
            <strong>
              Questions
            </strong>

            <p>
              {test.total_questions}
            </p>
          </div>

          <div>
            <strong>
              Marks
            </strong>

            <p>
              {test.total_marks}
            </p>
          </div>

          <div>
            <strong>
              Difficulty
            </strong>

            <p>
              {test.difficulty}
            </p>
          </div>

        </div>

      </div>

      <div className="flex gap-3">

        <button className="rounded-lg border px-5 py-2">
          ✏ Edit
        </button>

        <button className="rounded-lg border px-5 py-2">
          📄 Export PDF
        </button>

        <button className="rounded-lg border px-5 py-2">
          📊 Export CSV
        </button>

        <button
          onClick={handlePublish}
          disabled={publishing}
          className="rounded-lg bg-green-600 px-5 py-2 text-white"
        >
          {publishing
            ? "Publishing..."
            : "🚀 Publish Test"}
        </button>

      </div>

    </div>
  );
}