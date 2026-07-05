"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import EditQuestionDialog from "./EditQuestionDialog";

export interface AIQuestion {
  question: string;

  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };

  correct_answer: string;

  explanation?: string;
  hint?: string;
  difficulty?: string;
  bloom_level?: string;
  learning_objective?: string;
  tags?: string[];
}

interface QuestionCardProps {
  question: AIQuestion;
  index: number;

  onUpdate?: (question: AIQuestion) => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
}

export default function QuestionCard({
  question,
  index,
  onUpdate,
  onDuplicate,
  onDelete,
}: QuestionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <div className="rounded-xl border bg-white shadow-sm">

        {/* Header */}

        <div className="flex items-center justify-between border-b p-5">

          <div>
            <h3 className="text-lg font-semibold">
              Question {index}
            </h3>

            <div className="mt-2 flex flex-wrap gap-2">

              {question.difficulty && (
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                  {question.difficulty}
                </span>
              )}

              {question.bloom_level && (
                <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                  {question.bloom_level}
                </span>
              )}

            </div>
          </div>

          <div className="flex gap-2">

            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditOpen(true)}
            >
              ✏ Edit
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={onDuplicate}
            >
              📄 Duplicate
            </Button>

            <Button
              size="sm"
              variant="destructive"
              onClick={onDelete}
            >
              🗑 Delete
            </Button>

          </div>

        </div>

        {/* Question */}

        <div className="p-6">

          <p className="font-medium leading-7">
            {question.question}
          </p>

          <div className="mt-6 space-y-3">

            {(["A", "B", "C", "D"] as const).map((option) => (

              <div
                key={option}
                className={`rounded-lg border p-3 ${
                  question.correct_answer === option
                    ? "border-green-500 bg-green-50"
                    : ""
                }`}
              >
                <strong>{option}.</strong>{" "}
                {question.options[option]}
              </div>

            ))}

          </div>

          <div className="mt-6 rounded-lg border-l-4 border-green-600 bg-green-50 p-4">

            <strong>Correct Answer:</strong>{" "}
            {question.correct_answer}

          </div>

          <div className="mt-5">

            <Button
              variant="ghost"
              onClick={() =>
                setExpanded(!expanded)
              }
            >
              {expanded
                ? "Hide Details"
                : "Show Details"}
            </Button>

          </div>

          {expanded && (

            <div className="mt-5 rounded-xl bg-slate-50 p-5 space-y-5">

              {question.explanation && (
                <div>
                  <h4 className="font-semibold">
                    Explanation
                  </h4>

                  <p className="text-slate-600">
                    {question.explanation}
                  </p>
                </div>
              )}

              {question.hint && (
                <div>
                  <h4 className="font-semibold">
                    Hint
                  </h4>

                  <p className="text-slate-600">
                    {question.hint}
                  </p>
                </div>
              )}

              {question.learning_objective && (
                <div>
                  <h4 className="font-semibold">
                    Learning Objective
                  </h4>

                  <p className="text-slate-600">
                    {question.learning_objective}
                  </p>
                </div>
              )}

              {question.tags &&
                question.tags.length > 0 && (

                  <div>

                    <h4 className="font-semibold mb-2">
                      Tags
                    </h4>

                    <div className="flex flex-wrap gap-2">

                      {question.tags.map((tag) => (

                        <span
                          key={tag}
                          className="rounded-full bg-slate-200 px-3 py-1 text-xs"
                        >
                          {tag}
                        </span>

                      ))}

                    </div>

                  </div>

              )}

            </div>

          )}

        </div>

      </div>

      <EditQuestionDialog
        open={editOpen}
        question={question}
        onClose={() => setEditOpen(false)}
        onSave={(updatedQuestion) =>
          onUpdate?.(updatedQuestion)
        }
      />
    </>
  );
}