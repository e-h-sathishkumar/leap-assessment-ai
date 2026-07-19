"use client";

interface Props {
  question: any;
  answer?: string;
  onAnswer: (value: string) => void;
}

export default function QuestionOptions({
  question,
  answer,
  onAnswer,
}: Props) {
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
    <div className="space-y-4">
      {options.map((option) => (
        <label
          key={option.key}
          className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${
            answer === option.key
              ? "border-blue-600 bg-blue-50"
              : "hover:bg-slate-50"
          }`}
        >
          <input
            type="radio"
            name={`question-${question.id}`}
            checked={answer === option.key}
            onChange={() =>
              onAnswer(option.key)
            }
          />

          <span className="font-semibold">
            {option.key}.
          </span>

          <span>{option.value}</span>
        </label>
      ))}
    </div>
  );
}