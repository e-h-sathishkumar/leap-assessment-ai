"use client";

import { useMemo, useState } from "react";

interface Props {
  questions: any[];
}

export default function CreateTest({
  questions,
}: Props) {
  const [testName, setTestName] =
    useState("");

  const totalQuestions =
    questions.length;

  const totalMarks = useMemo(() => {
    return questions.reduce(
      (sum, q) => sum + (q.marks ?? 4),
      0
    );
  }, [questions]);

  const totalNegative = useMemo(() => {
    return questions.reduce(
      (sum, q) => sum + (q.negative_marks ?? 1),
      0
    );
  }, [questions]);

  const duration = totalQuestions;

  function handleCreateTest() {
    alert(
      "Next Step: Save Test and Open Assessment Settings"
    );
  }

  return (
    <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">

      <h2 className="text-2xl font-bold">
        Create Test
      </h2>

      <div className="mt-6 space-y-5">

        <div>

          <label className="mb-2 block font-medium">
            Test Name
          </label>

          <input
            value={testName}
            onChange={(e) =>
              setTestName(
                e.target.value
              )
            }
            placeholder="Enter Test Name"
            className="w-full rounded-lg border p-3"
          />

        </div>

        <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-5">

          <div>

            <strong>
              Questions
            </strong>

            <p>{totalQuestions}</p>

          </div>

          <div>

            <strong>
              Total Marks
            </strong>

            <p>{totalMarks}</p>

          </div>

          <div>

            <strong>
              Negative Marks
            </strong>

            <p>-{totalNegative}</p>

          </div>

          <div>

            <strong>
              Suggested Duration
            </strong>

            <p>{duration} Minutes</p>

          </div>

        </div>

        <button
          onClick={handleCreateTest}
          className="rounded-lg bg-green-600 px-8 py-3 text-white"
        >
          ✅ Create Test
        </button>

      </div>

    </div>
  );
}   