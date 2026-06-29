"use client";

import { Button } from "@/components/ui/button";

interface AIQuestion {
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
}

export default function QuestionCard({
  question,
  index,
}: QuestionCardProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between">

        <h3 className="text-lg font-bold">
          Question {index}
        </h3>

        <div className="flex gap-2">

          <Button
            size="sm"
            variant="outline"
          >
            Edit
          </Button>

          <Button
            size="sm"
          >
            Approve
          </Button>

          <Button
            size="sm"
            variant="destructive"
          >
            Reject
          </Button>

        </div>

      </div>

      <p className="mt-4 font-medium">
        {question.question}
      </p>

      <div className="mt-4 space-y-2">

        <p>A. {question.options.A}</p>

        <p>B. {question.options.B}</p>

        <p>C. {question.options.C}</p>

        <p>D. {question.options.D}</p>

      </div>

      <div className="mt-6 rounded-lg bg-slate-50 p-4">

        <p>
          <strong>Answer:</strong>{" "}
          {question.correct_answer}
        </p>

        <p className="mt-2">
          <strong>Explanation:</strong>{" "}
          {question.explanation}
        </p>

        <p className="mt-2">
          <strong>Hint:</strong>{" "}
          {question.hint}
        </p>

        <p className="mt-2">
          <strong>Difficulty:</strong>{" "}
          {question.difficulty}
        </p>

        <p className="mt-2">
          <strong>Bloom:</strong>{" "}
          {question.bloom_level}
        </p>

      </div>

    </div>
  );
}