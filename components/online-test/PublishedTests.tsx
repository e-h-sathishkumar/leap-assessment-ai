"use client";

import Link from "next/link";

interface Props {
  tests: any[];
}

export default function PublishedTests({ tests }: Props) {
  if (tests.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center">
        <h2 className="text-2xl font-semibold">
          No Published Tests
        </h2>

        <p className="mt-2 text-slate-500">
          There are currently no tests available.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {tests.map((test) => (
        <div
          key={test.id}
          className="rounded-xl border bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold">
            {test.title}
          </h2>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <strong>Subject</strong>
              <p>{test.subjects?.name}</p>
            </div>

            <div>
              <strong>Exam</strong>
              <p>{test.exam_type}</p>
            </div>

            <div>
              <strong>Questions</strong>
              <p>{test.total_questions}</p>
            </div>

            <div>
              <strong>Duration</strong>
              <p>{test.duration} Minutes</p>
            </div>

            <div>
              <strong>Total Marks</strong>
              <p>{test.maximum_marks}</p>
            </div>
          </div>

          <Link
            href={`/online-test/${test.id}/instructions`}
            className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            Start Test
          </Link>
        </div>
      ))}
    </div>
  );
}