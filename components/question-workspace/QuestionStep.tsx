"use client";

import { useState } from "react";

type Mode =
  | "ai"
  | "manual"
  | "upload"
  | "repository";

interface Preview {
  exam: string;
  subject: string;
  chapter: string;
  topic: string;
  questionType: string;
  difficulty: string;
  totalQuestions: number;
}

interface Props {
  preview: Preview;
}

export default function QuestionStep({
  preview,
}: Props) {
  const [mode, setMode] =
    useState<Mode>("ai");

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold">
          Question Creation
        </h2>

        <p className="mt-2 text-gray-500">
          Choose how you want to create questions.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <button
            type="button"
            onClick={() => setMode("ai")}
            className={`rounded-lg border p-5 transition ${
              mode === "ai"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            🤖 AI Generate
          </button>

          <button
            type="button"
            onClick={() => setMode("manual")}
            className={`rounded-lg border p-5 transition ${
              mode === "manual"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            ✍️ Manual
          </button>

          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`rounded-lg border p-5 transition ${
              mode === "upload"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            📄 Upload
          </button>

          <button
            type="button"
            onClick={() =>
              setMode("repository")
            }
            className={`rounded-lg border p-5 transition ${
              mode === "repository"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            📚 Repository
          </button>
        </div>
      </div>

      {mode === "ai" && (
        <div className="rounded-xl border bg-white p-8 shadow-sm">
          <h3 className="text-xl font-semibold">
            AI Question Generation
          </h3>

          <p className="mt-2 text-gray-500">
            AI question generation is handled by
            the main assessment generation flow.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">
                Exam
              </p>
              <p className="font-medium">
                {preview.exam}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Subject
              </p>
              <p className="font-medium">
                {preview.subject}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Chapter
              </p>
              <p className="font-medium">
                {preview.chapter || "AI Selected"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Topic
              </p>
              <p className="font-medium">
                {preview.topic || "AI Selected"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Question Type
              </p>
              <p className="font-medium">
                {preview.questionType}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Difficulty
              </p>
              <p className="font-medium">
                {preview.difficulty}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Total Questions
              </p>
              <p className="font-medium">
                {preview.totalQuestions}
              </p>
            </div>
          </div>
        </div>
      )}

      {mode === "manual" && (
        <div className="rounded-xl border bg-white p-8 shadow-sm">
          <h3 className="text-xl font-semibold">
            Manual Question Creation
          </h3>

          <p className="mt-2 text-gray-500">
            Manual question creation will be
            connected here.
          </p>
        </div>
      )}

      {mode === "upload" && (
        <div className="rounded-xl border bg-white p-8 shadow-sm">
          <h3 className="text-xl font-semibold">
            Upload Questions
          </h3>

          <p className="mt-2 text-gray-500">
            Question upload will be connected
            here.
          </p>
        </div>
      )}

      {mode === "repository" && (
        <div className="rounded-xl border bg-white p-8 shadow-sm">
          <h3 className="text-xl font-semibold">
            Question Repository
          </h3>

          <p className="mt-2 text-gray-500">
            Repository question selection will be
            connected here.
          </p>
        </div>
      )}
    </div>
  );
}