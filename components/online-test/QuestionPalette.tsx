"use client";

interface Props {
  questions: any[];
  currentQuestion: number;
  setCurrentQuestion: (index: number) => void;
  answers: Record<string, string>;
  visitedQuestions: Set<number>;
  reviewQuestions: Set<number>;
}

export default function QuestionPalette({
  questions,
  currentQuestion,
  setCurrentQuestion,
  answers,
  visitedQuestions,
  reviewQuestions,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <h2 className="mb-5 text-lg font-bold">
        Question Palette
      </h2>

      <div className="grid grid-cols-5 gap-3">
        {questions.map((question, index) => {
          const questionId = question.questions.id;

          const answered = !!answers[questionId];
          const isCurrent = currentQuestion === index;
          const visited = visitedQuestions.has(questionId);
          const markedForReview =
            reviewQuestions.has(questionId);

          let buttonClass =
            "border-slate-300 bg-white hover:bg-slate-100";

          if (isCurrent) {
            buttonClass =
              "border-blue-700 bg-blue-600 text-white";
          } else if (
            markedForReview &&
            answered
          ) {
            buttonClass =
              "border-purple-700 bg-purple-600 text-white";
          } else if (markedForReview) {
            buttonClass =
              "border-orange-700 bg-orange-500 text-white";
          } else if (answered) {
            buttonClass =
              "border-green-700 bg-green-600 text-white";
          } else if (visited) {
            buttonClass =
              "border-yellow-500 bg-yellow-100 text-slate-700";
          }

          return (
            <button
              key={questionId}
              onClick={() =>
                setCurrentQuestion(index)
              }
              className={`h-11 w-11 rounded-full border font-semibold transition ${buttonClass}`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      {/* Legend */}

      <div className="mt-8 space-y-3 text-sm">

        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-full bg-blue-600"></span>
          Current Question
        </div>

        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-full bg-green-600"></span>
          Answered
        </div>

        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-full bg-orange-500"></span>
          Marked for Review
        </div>

        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-full bg-purple-600"></span>
          Answered & Marked
        </div>

        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-full bg-yellow-200 border border-yellow-500"></span>
          Visited
        </div>

        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-full border border-slate-400 bg-white"></span>
          Not Visited
        </div>

      </div>
    </div>
  );
}