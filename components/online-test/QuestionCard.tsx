"use client";

import QuestionOptions from "./QuestionOptions";

interface Props {
  question: any;
  answer?: string;
  onSaveAnswer: (
    questionId: number,
    answer: string
  ) => void;
  onClearAnswer?: (
    questionId: number
  ) => void;
  onMarkForReview?: (
    questionId: number
  ) => void;
}

export default function QuestionCard({
  question,
  answer,
  onSaveAnswer,
  onClearAnswer,
  onMarkForReview,
}: Props) {
  if (!question) {
    return (
      <div className="rounded-xl border bg-white p-8">
        Loading Question...
      </div>
    );
  }

  const q = question.questions;

  function handleAnswer(value: string) {
    console.log("Saving", q.id, value);
    onSaveAnswer(q.id, value);
  }

  return (
    <div className="rounded-xl border bg-white p-8 shadow-sm">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-xl font-bold">
          Question {question.question_order}
        </h2>

        <div className="text-right text-sm">
          <p>
            <strong>Marks:</strong> {question.marks}
          </p>

          <p>
            <strong>Negative:</strong> -{question.negative_marks}
          </p>
        </div>

      </div>

      <div className="mb-8 text-lg whitespace-pre-wrap">
        {q.question_text}
      </div>

      {q.image_url && (
        <img
          src={q.image_url}
          alt="Question"
          className="mb-6 max-h-80 rounded-lg border"
        />
      )}

      <QuestionOptions
        question={q}
        answer={answer}
        onAnswer={handleAnswer}
      />

      <div className="mt-8 flex gap-4">

        <button
          type="button"
          onClick={() =>
            onClearAnswer?.(q.id)
          }
          className="rounded-lg border px-5 py-2 hover:bg-slate-100"
        >
          Clear Response
        </button>

        <button
          type="button"
          onClick={() =>
            onMarkForReview?.(q.id)
          }
          className="rounded-lg bg-amber-500 px-5 py-2 text-white hover:bg-amber-600"
        >
          Mark for Review
        </button>

      </div>

    </div>
  );
}