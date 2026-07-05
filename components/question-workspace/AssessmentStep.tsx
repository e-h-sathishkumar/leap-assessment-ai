"use client";

import { useState } from "react";

export default function AssessmentStep() {
  const [testName, setTestName] = useState("");

  const [duration, setDuration] = useState(180);

  const [negativeMarking, setNegativeMarking] =
    useState(true);

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">

      <h2 className="text-2xl font-bold">
        Assessment Builder
      </h2>

      <p className="mt-2 text-gray-500">
        Configure your assessment.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">

        <div>

          <label className="mb-2 block">
            Test Name
          </label>

          <input
            value={testName}
            onChange={(e) =>
              setTestName(e.target.value)
            }
            placeholder="NEET Unit Test - Mechanics"
            className="w-full rounded-lg border p-3"
          />

        </div>

        <div>

          <label className="mb-2 block">
            Duration (Minutes)
          </label>

          <input
            type="number"
            value={duration}
            onChange={(e) =>
              setDuration(Number(e.target.value))
            }
            className="w-full rounded-lg border p-3"
          />

        </div>

      </div>

      <div className="mt-8 flex items-center gap-3">

        <input
          type="checkbox"
          checked={negativeMarking}
          onChange={(e) =>
            setNegativeMarking(e.target.checked)
          }
        />

        <span>
          Enable Negative Marking
        </span>

      </div>

      <div className="mt-10 flex justify-end">

        <button
          className="rounded-lg bg-green-600 px-8 py-3 text-white"
        >
          Save Assessment
        </button>

      </div>

    </div>
  );
}