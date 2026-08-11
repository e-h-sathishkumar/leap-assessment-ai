"use client";

import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  test: any;
}

export default function TestInstructions({
  test,
}: Props) {
  const router = useRouter();

  const [starting, setStarting] =
    useState(false);

  const [error, setError] =
    useState("");

  // =====================================================
  // START TEST
  // =====================================================

  async function handleStart() {
    if (starting) return;

    try {
      setStarting(true);
      setError("");

      // -------------------------------------------------
      // GET AUTHENTICATED STUDENT
      // -------------------------------------------------

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        console.error(
          "AUTH ERROR:",
          authError
        );

        throw new Error(
          authError.message
        );
      }

      if (!user) {
        throw new Error(
          "Student session has expired. Please login again."
        );
      }

      // -------------------------------------------------
      // REAL SUPABASE STUDENT ID
      // -------------------------------------------------

      const studentId = user.id;

      console.log(
        "========================================"
      );

      console.log(
        "STUDENT AUTHENTICATION"
      );

      console.log(
        "Student ID:",
        studentId
      );

      console.log(
        "Student Email:",
        user.email
      );

      console.log(
        "========================================"
      );

      // -------------------------------------------------
      // TEST INFORMATION
      // -------------------------------------------------

      console.log(
        "========================================"
      );

      console.log(
        "STARTING STUDENT TEST"
      );

      console.log(
        "Test ID:",
        test.id
      );

      console.log(
        "Student ID:",
        studentId
      );

      console.log(
        "========================================"
      );

      // -------------------------------------------------
      // CREATE TEST ATTEMPT
      // -------------------------------------------------

      const response =
        await fetch(
          "/api/test-attempts",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              testId: test.id,
              studentId: studentId,
            }),
          }
        );

      // -------------------------------------------------
      // READ API RESPONSE
      // -------------------------------------------------

      const data =
        await response.json();

      console.log(
        "========================================"
      );

      console.log(
        "CREATE ATTEMPT RESPONSE"
      );

      console.log(
        data
      );

      console.log(
        "HTTP STATUS:",
        response.status
      );

      console.log(
        "========================================"
      );

      // -------------------------------------------------
      // API ERROR
      // -------------------------------------------------

      if (!response.ok) {
        throw new Error(
          data?.error ??
            "Unable to start test."
        );
      }

      // -------------------------------------------------
      // VALIDATE ATTEMPT ID
      // -------------------------------------------------

      if (!data?.id) {
        throw new Error(
          "Test attempt was created but no attempt ID was returned."
        );
      }

      // -------------------------------------------------
      // SAVE CURRENT ATTEMPT
      // -------------------------------------------------

      sessionStorage.setItem(
        "leap_current_attempt_id",
        String(data.id)
      );

      sessionStorage.setItem(
        "leap_current_test_id",
        String(test.id)
      );

      sessionStorage.setItem(
        "leap_current_student_id",
        String(studentId)
      );

      // -------------------------------------------------
      // GO TO EXAM
      // -------------------------------------------------

      console.log(
        "Attempt created successfully."
      );

      console.log(
        "Attempt ID:",
        data.id
      );

      console.log(
        "Redirecting to exam..."
      );

      router.push(
        `/online-test/${test.id}/attempt/${data.id}`
      );

    } catch (err) {
      console.error(
        "========================================"
      );

      console.error(
        "START TEST ERROR"
      );

      console.error(
        err
      );

      console.error(
        "========================================"
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to start test."
      );

      setStarting(false);
    }
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">

      <div className="mx-auto max-w-5xl rounded-2xl border bg-white p-8 shadow-lg">

        {/* Header */}

        <div className="border-b pb-6">

          <p className="text-sm font-semibold uppercase tracking-wide text-green-600">
            LEAP Assessment
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            {test.title}
          </h1>

          <p className="mt-2 text-slate-500">
            Read the instructions carefully before starting.
          </p>

        </div>

        {/* Test Information */}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <InfoCard
            label="Subject"
            value={
              test.subjects?.name ??
              "Not specified"
            }
          />

          <InfoCard
            label="Exam"
            value={
              test.exam_type ??
              "Not specified"
            }
          />

          <InfoCard
            label="Duration"
            value={`${test.duration ?? 0} Minutes`}
          />

          <InfoCard
            label="Questions"
            value={String(
              test.total_questions ?? 0
            )}
          />

          <InfoCard
            label="Maximum Marks"
            value={String(
              test.maximum_marks ?? 0
            )}
          />

          <InfoCard
            label="Negative Marking"
            value={
              test.negative_marking
                ? "Yes"
                : "No"
            }
          />

        </div>

        {/* Instructions */}

        <div className="mt-10 rounded-xl border border-blue-200 bg-blue-50 p-6">

          <h2 className="text-xl font-bold text-slate-900">
            Instructions
          </h2>

          <ul className="mt-5 space-y-3 text-slate-700">

            <li className="flex gap-3">
              <span className="font-bold text-blue-600">
                1.
              </span>

              Read every question carefully.
            </li>

            <li className="flex gap-3">
              <span className="font-bold text-blue-600">
                2.
              </span>

              Select the best answer for each question.
            </li>

            <li className="flex gap-3">
              <span className="font-bold text-blue-600">
                3.
              </span>

              Your answers are automatically saved.
            </li>

            <li className="flex gap-3">
              <span className="font-bold text-blue-600">
                4.
              </span>

              You can move between questions using the question palette.
            </li>

            <li className="flex gap-3">
              <span className="font-bold text-blue-600">
                5.
              </span>

              You can mark questions for review.
            </li>

            <li className="flex gap-3">
              <span className="font-bold text-blue-600">
                6.
              </span>

              Do not close or refresh the browser during the examination.
            </li>

            <li className="flex gap-3">
              <span className="font-bold text-blue-600">
                7.
              </span>

              The timer starts when you click Start Test.
            </li>

            <li className="flex gap-3">
              <span className="font-bold text-blue-600">
                8.
              </span>

              Submit the test before the allotted time expires.
            </li>

          </ul>

        </div>

        {/* Error */}

        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">

            {error}

          </div>
        )}

        {/* Start Button */}

        <div className="mt-10 flex justify-end">

          <button
            type="button"
            onClick={handleStart}
            disabled={starting}
            className="rounded-xl bg-green-600 px-10 py-4 font-semibold text-white shadow transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >

            {starting
              ? "Starting Test..."
              : "Start Test"}

          </button>

        </div>

      </div>

    </main>
  );
}

// =====================================================
// INFORMATION CARD
// =====================================================

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border bg-slate-50 p-5">

      <p className="text-sm font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-lg font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
}