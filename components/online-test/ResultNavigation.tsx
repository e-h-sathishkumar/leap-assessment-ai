"use client";

interface Props {
  questions: any[];
  attemptId: number;
}

export default function ResultNavigation({
  questions,
  attemptId,
}: Props) {
  return (
    <div className="mb-10 rounded-xl border bg-white p-6 shadow">

      <h2 className="mb-6 text-2xl font-bold">
        Question Navigation
      </h2>

      <div className="flex flex-wrap gap-3">

        {questions.map((tq) => {

          const answer =
            tq.questions.student_answers?.find(
              (a: any) =>
                a.attempt_id === attemptId
            );

          let color =
            "bg-yellow-500";

          if (answer) {
            color = answer.is_correct
              ? "bg-green-600"
              : "bg-red-600";
          }

          return (
            <button
              key={tq.question_order}
              onClick={() =>
                document
                  .getElementById(
                    `question-${tq.question_order}`
                  )
                  ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  })
              }
              className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white transition hover:scale-105 ${color}`}
            >
              {tq.question_order}
            </button>
          );
        })}

      </div>

      <div className="mt-6 flex flex-wrap gap-6 text-sm">

        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-full bg-green-600"></span>
          Correct
        </div>

        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-full bg-red-600"></span>
          Wrong
        </div>

        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-full bg-yellow-500"></span>
          Skipped
        </div>

      </div>

    </div>
  );
}