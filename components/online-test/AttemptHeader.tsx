"use client";

import { useEffect, useState } from "react";

interface Props {
  attempt: any;
  onTimeUp?: () => Promise<void>;
}

export default function AttemptHeader({
  attempt,
  onTimeUp,
}: Props) {
  const totalSeconds =
    attempt.tests.duration_minutes * 60;

  const [remainingSeconds, setRemainingSeconds] =
    useState(totalSeconds);

  const [submitted, setSubmitted] =
    useState(false);

  useEffect(() => {
    if (submitted) return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);

          if (!submitted && onTimeUp) {
            setSubmitted(true);
            onTimeUp();
          }

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted, onTimeUp]);

  const hours = Math.floor(
    remainingSeconds / 3600
  );

  const minutes = Math.floor(
    (remainingSeconds % 3600) / 60
  );

  const seconds = remainingSeconds % 60;

  const timeString = `${String(hours).padStart(
    2,
    "0"
  )}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(
    2,
    "0"
  )}`;

  const danger =
    remainingSeconds <= 600;

  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Test Information */}

        <div>

          <h1 className="text-2xl font-bold">
            {attempt.tests.title}
          </h1>

          <p className="text-sm text-slate-500">
            {attempt.tests.subjects?.name}
          </p>

        </div>

        {/* Duration */}

        <div className="text-center">

          <p className="text-xs uppercase tracking-wide text-slate-500">
            Duration
          </p>

          <p className="text-xl font-bold text-blue-600">
            {attempt.tests.duration_minutes} min
          </p>

        </div>

        {/* Live Timer */}

        <div className="text-center">

          <p className="text-xs uppercase tracking-wide text-slate-500">
            Time Left
          </p>

          <p
            className={`mt-1 text-3xl font-bold ${
              danger
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {timeString}
          </p>

        </div>

      </div>

    </header>
  );
}