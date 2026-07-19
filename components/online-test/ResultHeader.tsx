interface Props {
  attempt: any;
  testId: string;
  attemptId: string;
}

export default function ResultHeader({
  attempt,
  testId,
  attemptId,
}: Props) {
  return (
    <div className="mb-8 rounded-2xl border bg-white p-8 shadow">

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h1 className="text-4xl font-bold text-slate-800">
            {attempt.tests.title}
          </h1>

          <p className="mt-2 text-slate-500">
            Online Test Result Dashboard
          </p>

        </div>

        <div className="grid grid-cols-2 gap-6 text-sm">

          <InfoItem
            label="Test ID"
            value={testId}
          />

          <InfoItem
            label="Attempt ID"
            value={attemptId}
          />

          <InfoItem
            label="Status"
            value={attempt.status}
          />

          <InfoItem
            label="Submitted"
            value={
              attempt.submitted_at
                ? new Date(
                    attempt.submitted_at
                  ).toLocaleString()
                : "-"
            }
          />

        </div>

      </div>

    </div>
  );
}

interface InfoProps {
  label: string;
  value: string | number;
}

function InfoItem({
  label,
  value,
}: InfoProps) {
  return (
    <div>

      <p className="text-xs uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-lg font-semibold text-slate-800">
        {value}
      </p>

    </div>
  );
}