interface Props {
  attempt: any;
}

export default function ResultSummary({
  attempt,
}: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

      <SummaryCard
        title="Score"
        value={attempt.score}
        color="text-blue-600"
      />

      <SummaryCard
        title="Percentage"
        value={`${attempt.percentage}%`}
        color="text-green-600"
      />

      <SummaryCard
        title="Questions"
        value={attempt.tests.total_questions}
        color="text-slate-700"
      />

      <SummaryCard
        title="Status"
        value={attempt.status}
        color="text-green-600"
      />

      <SummaryCard
        title="Correct"
        value={attempt.correct}
        color="text-green-600"
      />

      <SummaryCard
        title="Wrong"
        value={attempt.wrong}
        color="text-red-600"
      />

      <SummaryCard
        title="Skipped"
        value={attempt.skipped}
        color="text-yellow-600"
      />

      <SummaryCard
        title="Accuracy"
        value={`${attempt.accuracy}%`}
        color="text-indigo-600"
      />

    </div>
  );
}

interface CardProps {
  title: string;
  value: string | number;
  color?: string;
}

function SummaryCard({
  title,
  value,
  color = "text-slate-800",
}: CardProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow transition hover:shadow-lg">

      <p className="text-sm font-medium text-gray-500">
        {title}
      </p>

      <h2 className={`mt-3 text-3xl font-bold ${color}`}>
        {value}
      </h2>

    </div>
  );
}