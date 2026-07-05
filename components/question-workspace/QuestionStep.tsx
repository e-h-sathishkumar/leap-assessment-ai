"use client";

import { useState } from "react";

import AIQuestionStudio from "./question-editor/AIQuestionStudio";
import ManualQuestion from "./question-editor/ManualQuestion";
import UploadQuestion from "./question-editor/UploadQuestion";
import RepositoryQuestion from "./question-editor/RepositoryQuestion";

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

  const [mode, setMode] = useState<Mode>("ai");

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
            onClick={() => setMode("manual")}
            className={`rounded-lg border p-5 transition ${
              mode === "manual"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            ✍ Manual
          </button>

          <button
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
            onClick={() => setMode("repository")}
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

     <AIQuestionStudio
  preview={preview}
/>

      {mode === "manual" && <ManualQuestion />}

      {mode === "upload" && <UploadQuestion />}

      {mode === "repository" && <RepositoryQuestion />}

    </div>
  );
}