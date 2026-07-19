interface Props {
  testQuestion: any;
  attemptId: number;
}

export default function ResultQuestionCard({
  testQuestion,
  attemptId,
}: Props) {
  const question = testQuestion.questions;

  const answer = question.student_answers?.find(
    (a: any) => a.attempt_id === attemptId
  );

  const studentAnswer = answer?.selected_answer ?? null;

  const correctAnswer = question.correct_answer;

  const isCorrect = answer?.is_correct ?? false;

  const options = [
    {
      key: "A",
      value: question.option_a,
    },
    {
      key: "B",
      value: question.option_b,
    },
    {
      key: "C",
      value: question.option_c,
    },
    {
      key: "D",
      value: question.option_d,
    },
  ];

  return (
    <div
      id={`question-${testQuestion.question_order}`}
      className="mb-8 rounded-xl border bg-white p-6 shadow"
    >
      {/* Header */}

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">
          Question {testQuestion.question_order}
        </h2>

        <span
          className={`rounded-full px-4 py-1 text-sm font-semibold ${
            isCorrect
              ? "bg-green-100 text-green-700"
              : studentAnswer
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {isCorrect
            ? "✓ Correct"
            : studentAnswer
            ? "✗ Wrong"
            : "⏭ Skipped"}
        </span>
      </div>

      {/* Question */}

      <p className="mb-6 whitespace-pre-wrap text-lg leading-8">
        {question.question_text}
      </p>

      {/* Options */}

      <div className="space-y-3">
        {options.map((option) => {
          const isStudent =
            option.key === studentAnswer;

          const isCorrectOption =
            option.key === correctAnswer;

          return (
            <div
              key={option.key}
              className={`rounded-lg border p-4 transition ${
                isCorrectOption
                  ? "border-green-500 bg-green-50"
                  : isStudent
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <strong>{option.key}.</strong>{" "}
                  {option.value}
                </div>

                <div className="flex gap-2">
                  {isCorrectOption && (
                    <span className="rounded bg-green-600 px-2 py-1 text-xs text-white">
                      Correct
                    </span>
                  )}

                  {isStudent && (
                    <span className="rounded bg-blue-600 px-2 py-1 text-xs text-white">
                      Your Answer
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}

      <div className="mt-6 grid grid-cols-3 gap-4 rounded-lg bg-gray-50 p-4">
        <div>
          <p className="text-sm text-gray-500">
            Your Answer
          </p>

          <p className="text-lg font-semibold">
            {studentAnswer ?? "Not Answered"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Correct Answer
          </p>

          <p className="text-lg font-semibold text-green-700">
            {correctAnswer}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Marks Awarded
          </p>

          <p
            className={`text-lg font-semibold ${
              (answer?.marks_obtained ?? 0) >= 0
                ? "text-green-700"
                : "text-red-700"
            }`}
          >
            {answer?.marks_obtained ?? 0}
          </p>
        </div>
      </div>

      {/* Explanation */}

      {question.explanation && (
        <div className="mt-8 rounded-xl border border-blue-300 bg-blue-50 p-6">
          <h3 className="mb-3 text-xl font-semibold text-blue-700">
            📘 Explanation
          </h3>

          <div className="whitespace-pre-wrap leading-8 text-gray-700">
            {question.explanation}
          </div>
        </div>
      )}
    </div>
  );
}