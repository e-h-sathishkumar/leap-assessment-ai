"use client";

import { useState } from "react";

import QuestionEditor from "@/components/question-editor/QuestionEditor";
import { useGeneratedQuestions } from "@/hooks/useGeneratedQuestions";

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

export default function AIQuestionStudio({
  preview,
}: Props) {
  const {
    setQuestions,
    setSelectedQuestion,
  } = useGeneratedQuestions();

  const [loading, setLoading] = useState(false);

  async function generateQuestions() {
    if (
      !preview.subject ||
      !preview.chapter ||
      !preview.topic
    ) {
      alert(
        "Please complete Academic Information before generating questions."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/ai/generate-question",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            exam: preview.exam,
            subject: preview.subject,
            chapter: preview.chapter,
            topic: preview.topic,
            difficulty:
              preview.difficulty,
            questionType:
              preview.questionType,
            totalQuestions:
              preview.totalQuestions,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.error ??
            "Question generation failed."
        );
        return;
      }

      const generated = Array.isArray(
        data.questions
      )
        ? data.questions
        : [data];

      const formatted = generated.map(
        (q: any, index: number) => ({
          id: index + 1,

          subject_id: 0,
          chapter_id: 0,
          topic_id: 0,

          question:
            q.question ?? "",

          questionType:
            q.questionType ?? "MCQ",

          difficulty:
            q.difficulty ?? "Medium",

          category:
            q.category ??
            "Conceptual",

          options:
            q.options ?? [
              "",
              "",
              "",
              "",
            ],

          correctAnswer:
            q.correctAnswer ?? "A",

          explanation:
            q.explanation ?? "",

          hint:
            q.hint ?? "",

          learningObjective:
            q.learningObjective ??
            "",

          marks:
            q.marks ?? 4,

          negative_marks:
            q.negative_marks ?? 1,

          status: "Generated",
        })
      );

      setQuestions(formatted);

      if (formatted.length > 0) {
        setSelectedQuestion(
          formatted[0]
        );
      }
    } catch (err) {
      console.error(err);

      alert(
        "Unable to generate questions."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">

      <div className="rounded-xl border bg-white p-6 shadow-sm">

        <h2 className="text-2xl font-bold">
          AI Question Studio
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Review the academic information below and
          click Generate Questions.
        </p>

        <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-5">

          <h3 className="mb-4 text-lg font-semibold">
            Academic Summary
          </h3>

          <div className="grid grid-cols-2 gap-4">

            <div>
              <span className="font-medium">
                Exam
              </span>
              <p>{preview.exam}</p>
            </div>

            <div>
              <span className="font-medium">
                Subject
              </span>
              <p>
                {preview.subject || "-"}
              </p>
            </div>

            <div>
              <span className="font-medium">
                Chapter
              </span>
              <p>
                {preview.chapter || "-"}
              </p>
            </div>

            <div>
              <span className="font-medium">
                Topic
              </span>
              <p>
                {preview.topic || "-"}
              </p>
            </div>

            <div>
              <span className="font-medium">
                Question Type
              </span>
              <p>
                {preview.questionType}
              </p>
            </div>

            <div>
              <span className="font-medium">
                Difficulty
              </span>
              <p>
                {preview.difficulty}
              </p>
            </div>

            <div>
              <span className="font-medium">
                Questions
              </span>
              <p>
                {preview.totalQuestions}
              </p>
            </div>

          </div>

        </div>

        <button
          onClick={
            generateQuestions
          }
          disabled={
            loading ||
            !preview.subject ||
            !preview.chapter ||
            !preview.topic
          }
          className="mt-8 rounded-lg bg-blue-600 px-8 py-3 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Generating..."
            : "🤖 Generate Questions"}
        </button>

      </div>

      <QuestionEditor />

    </div>
  );
}