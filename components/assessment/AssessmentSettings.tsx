"use client";

import { useState } from "react";

interface Props {
  assessmentId: number;
}

export default function AssessmentSettings({
  assessmentId,
}: Props) {
  const [shuffleQuestions, setShuffleQuestions] =
    useState(false);

  const [shuffleOptions, setShuffleOptions] =
    useState(false);

  const [showResultImmediately, setShowResultImmediately] =
    useState(true);

  const [allowCalculator, setAllowCalculator] =
    useState(false);

  const [maxAttempts, setMaxAttempts] =
    useState(1);

  const [password, setPassword] =
    useState("");

  const handleSave = () => {
    console.log({
      assessmentId,
      shuffleQuestions,
      shuffleOptions,
      showResultImmediately,
      allowCalculator,
      maxAttempts,
      password,
    });

    alert("Assessment Settings Saved");
  };

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">

      <h2 className="text-2xl font-bold">
        Assessment Settings
      </h2>

      <div className="mt-6 space-y-5">

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={shuffleQuestions}
            onChange={(e) =>
              setShuffleQuestions(e.target.checked)
            }
          />
          Shuffle Questions
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={shuffleOptions}
            onChange={(e) =>
              setShuffleOptions(e.target.checked)
            }
          />
          Shuffle Options
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={allowCalculator}
            onChange={(e) =>
              setAllowCalculator(e.target.checked)
            }
          />
          Allow Calculator
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={showResultImmediately}
            onChange={(e) =>
              setShowResultImmediately(e.target.checked)
            }
          />
          Show Result Immediately
        </label>

        <div>

          <label className="mb-2 block font-medium">
            Maximum Attempts
          </label>

          <input
            type="number"
            min={1}
            value={maxAttempts}
            onChange={(e) =>
              setMaxAttempts(Number(e.target.value))
            }
            className="w-40 rounded-lg border p-3"
          />

        </div>

        <div>

          <label className="mb-2 block font-medium">
            Password (Optional)
          </label>

          <input
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full rounded-lg border p-3"
          />

        </div>

        <button
          onClick={handleSave}
          className="rounded-lg bg-blue-600 px-8 py-3 text-white"
        >
          Save Settings
        </button>

      </div>

    </div>
  );
}