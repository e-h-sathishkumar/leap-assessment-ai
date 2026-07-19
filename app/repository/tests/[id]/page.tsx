import { notFound } from "next/navigation";
import { getTestById } from "@/services/test.service";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TestViewPage({
  params,
}: PageProps) {
  const { id } = await params;

  const test = await getTestById(Number(id));

  if (!test) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">

      {/* Header */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold">
          {test.title}
        </h1>

        <p className="mt-2 text-slate-500">
          Read-only Test Preview
        </p>
      </div>

      {/* Test Information */}
      <div className="grid grid-cols-2 gap-4 rounded-xl border bg-white p-6 shadow-sm md:grid-cols-4">

<InfoCard
  title="Exam"
  value={test.exam}
/>

<InfoCard
  title="Subject"
  value={test.subjects?.name}
/>

<InfoCard
  title="Duration"
  value={`${test.duration_minutes} mins`}
/>

<InfoCard
  title="Questions"
  value={String(test.total_questions)}
/>

<InfoCard
  title="Marks"
  value={String(test.total_marks)}
/>

<InfoCard
  title="Status"
  value={test.status}
/>

      </div>

      {/* Questions */}

      <div className="space-y-6">

        {test.test_questions?.map(
          (item: any, index: number) => {
           const q = item.questions;

if (!q) return null;
            return (
              <div
                key={item.id}
                className="rounded-xl border bg-white p-6 shadow-sm"
              >
                <h2 className="mb-4 text-lg font-semibold">
                  Question {index + 1}
                </h2>

                <p className="whitespace-pre-wrap">
                  {q.question}
                </p>

                <div className="mt-5 space-y-2">

                  <Option
                    label="A"
                    value={q.option_a}
                  />

                  <Option
                    label="B"
                    value={q.option_b}
                  />

                  <Option
                    label="C"
                    value={q.option_c}
                  />

                  <Option
                    label="D"
                    value={q.option_d}
                  />

                  {q.option_e && (
                    <Option
                      label="E"
                      value={q.option_e}
                    />
                  )}

                </div>

                <div className="mt-6 rounded-lg bg-green-50 p-4">

                  <p>
                    <strong>Correct Answer:</strong>{" "}
                    {q.correct_answer}
                  </p>

                  <p className="mt-2">
                    <strong>Difficulty:</strong>{" "}
                    {q.difficulty}
                  </p>

                  <p className="mt-2">
                    <strong>Marks:</strong>{" "}
                    {item.marks}
                  </p>

                  <p className="mt-2">
                    <strong>Negative Marks:</strong>{" "}
                    {item.negative_marks}
                  </p>

                  {q.explanation && (
                    <div className="mt-4">
                      <strong>Explanation</strong>

                      <p className="mt-1 whitespace-pre-wrap text-slate-700">
                        {q.explanation}
                      </p>
                    </div>
                  )}

                </div>
              </div>
            );
          }
        )}

      </div>

    </div>
  );
}

function InfoCard({
  title,
  value,
}: {
  title: string;
  value: string | number | undefined | null;
}) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-lg font-semibold">
        {value ?? "-"}
      </p>
    </div>
  );
}

function Option({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded border p-3">
      <strong>{label}.</strong> {value}
    </div>
  );
}