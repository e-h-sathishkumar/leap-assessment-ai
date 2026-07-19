interface Props {
  attempt: any;
}

export default function PerformanceDashboard({
  attempt,
}: Props) {
  const percentage = Number(attempt.percentage ?? 0);
  const accuracy = Number(attempt.accuracy ?? 0);

  const remark =
    percentage >= 90
      ? "Outstanding"
      : percentage >= 75
      ? "Excellent"
      : percentage >= 60
      ? "Very Good"
      : percentage >= 40
      ? "Good"
      : "Needs Improvement";

  return (
    <div className="mt-8 rounded-2xl border bg-white p-8 shadow">

      <h2 className="mb-8 text-2xl font-bold">
        Performance Dashboard
      </h2>

      {/* Percentage */}

      <div className="mb-8">

        <div className="mb-2 flex justify-between">

          <span className="font-medium">
            Overall Score
          </span>

          <span className="font-bold text-blue-600">
            {percentage.toFixed(2)}%
          </span>

        </div>

        <div className="h-4 overflow-hidden rounded-full bg-slate-200">

          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-700"
            style={{
              width: `${percentage}%`,
            }}
          />

        </div>

      </div>

      {/* Statistics */}

      <div className="grid gap-6 md:grid-cols-4">

        <StatCard
          title="Correct"
          value={attempt.correct}
          color="text-green-600"
        />

        <StatCard
          title="Wrong"
          value={attempt.wrong}
          color="text-red-600"
        />

        <StatCard
          title="Skipped"
          value={attempt.skipped}
          color="text-yellow-600"
        />

        <StatCard
          title="Accuracy"
          value={`${accuracy.toFixed(2)}%`}
          color="text-indigo-600"
        />

      </div>

      {/* Remark */}

      <div className="mt-10 rounded-xl bg-slate-50 p-6">

        <p className="text-sm uppercase tracking-wide text-slate-500">
          Overall Performance
        </p>

        <h3 className="mt-2 text-3xl font-bold text-slate-800">
          {remark}
        </h3>

      </div>

    </div>
  );
}

interface CardProps {
  title: string;
  value: string | number;
  color: string;
}

function StatCard({
  title,
  value,
  color,
}: CardProps) {
  return (
    <div className="rounded-xl border bg-white p-5 text-center">

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <h3 className={`mt-3 text-3xl font-bold ${color}`}>
        {value}
      </h3>

    </div>
  );
}