"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  FileText,
  Loader2,
  Send,
} from "lucide-react";

import {
  getTestById,
  publishTest,
} from "@/services/test.service";

// ============================================================
// TYPES
// ============================================================

interface QuestionData {
  id: number;
  question_text: string;
  option_a: string | null;
  option_b: string | null;
  option_c: string | null;
  option_d: string | null;
  option_e?: string | null;
  correct_answer: string | null;
  explanation: string | null;
  hint: string | null;
  difficulty: string | null;
  learning_objective: string | null;
  marks: number | null;
  negative_marks: number | null;
}

interface TestQuestion {
  id: number;
  question_order: number;
  marks: number | null;
  negative_marks: number | null;
  questions: QuestionData | null;
}

interface TestData {
  id: number;
  title: string | null;
  exam: string | null;
  class_name: string | null;
  subject_id: number | null;
  chapter_id: number | null;
  topic_id: number | null;
  total_questions: number | null;
  total_marks: number | null;
  duration_minutes: number | null;
  status: string | null;
  description?: string | null;
  difficulty?: string | null;

  subjects?: {
    id: number;
    name: string;
  } | null;

  test_questions?: TestQuestion[];
}

// ============================================================
// PAGE
// ============================================================

export default function TestViewPage() {
  const params = useParams();
  const router = useRouter();

  const testId = Number(params.id);

  const [test, setTest] =
    useState<TestData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [publishing, setPublishing] =
    useState(false);

  const [publishSuccess, setPublishSuccess] =
    useState(false);

  const [visibleAnswers, setVisibleAnswers] =
    useState<Record<number, boolean>>({});

  // ==========================================================
  // LOAD TEST
  // ==========================================================

  useEffect(() => {
    if (!testId || Number.isNaN(testId)) {
      setError("Invalid test ID.");
      setLoading(false);
      return;
    }

    async function loadTest() {
      try {
        setLoading(true);
        setError("");

        const data =
          await getTestById(testId);

        if (!data) {
          throw new Error(
            "Test not found."
          );
        }

        setTest(data as TestData);

      } catch (err) {
        console.error(
          "========================================"
        );

        console.error(
          "LOAD TEST ERROR"
        );

        console.error(err);

        console.error(
          "========================================"
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load test."
        );

      } finally {
        setLoading(false);
      }
    }

    loadTest();

  }, [testId]);

  // ==========================================================
  // TOGGLE ANSWER
  // ==========================================================

  function toggleAnswer(
    questionId: number
  ) {
    setVisibleAnswers((previous) => ({
      ...previous,
      [questionId]:
        !previous[questionId],
    }));
  }

  // ==========================================================
  // PUBLISH TEST
  // ==========================================================

  async function handlePublish() {
    if (!test) {
      return;
    }

    if (test.status === "Published") {
      return;
    }

    try {
      setPublishing(true);
      setError("");
      setPublishSuccess(false);

      await publishTest(test.id);

      setTest((previous) =>
        previous
          ? {
              ...previous,
              status: "Published",
            }
          : previous
      );

      setPublishSuccess(true);

    } catch (err) {
      console.error(
        "========================================"
      );

      console.error(
        "PUBLISH TEST ERROR"
      );

      console.error(err);

      console.error(
        "========================================"
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to publish test."
      );

    } finally {
      setPublishing(false);
    }
  }

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">

        <div className="flex min-h-screen items-center justify-center">

          <div className="flex items-center gap-3 text-slate-600">

            <Loader2 className="h-5 w-5 animate-spin" />

            Loading test...

          </div>

        </div>

      </div>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error && !test) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">

        <div className="mx-auto max-w-5xl">

          <button
            type="button"
            onClick={() =>
              router.push(
                "/repository/tests"
              )
            }
            className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />

            Back to Test Repository
          </button>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-700">
            {error}
          </div>

        </div>

      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">

        <div className="mx-auto max-w-5xl">

          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-700">
            Test not found.
          </div>

        </div>

      </div>
    );
  }

  // ==========================================================
  // QUESTIONS
  // ==========================================================

  const questions =
    [...(test.test_questions ?? [])].sort(
      (a, b) =>
        a.question_order -
        b.question_order
    );

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ==================================================== */}
      {/* HEADER */}
      {/* ==================================================== */}

      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto max-w-6xl px-6 py-6">

          {/* BACK */}

          <button
            type="button"
            onClick={() =>
              router.push(
                "/repository/tests"
              )
            }
            className="mb-5 flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />

            Back to Test Repository
          </button>

          {/* TITLE AREA */}

          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

            <div>

              {/* BADGES */}

              <div className="flex flex-wrap items-center gap-2">

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    test.status ===
                    "Published"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {test.status ??
                    "Draft"}
                </span>

                {test.exam && (
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                    {test.exam}
                  </span>
                )}

                {test.class_name && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {test.class_name}
                  </span>
                )}

              </div>

              {/* TITLE */}

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                {test.title ??
                  `Test #${test.id}`}
              </h1>

              {/* SUBJECT */}

              {test.subjects?.name && (
                <p className="mt-2 text-slate-600">
                  {test.subjects.name}
                </p>
              )}

              {/* DESCRIPTION */}

              {test.description && (
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
                  {test.description}
                </p>
              )}

            </div>

            {/* HEADER ACTION */}

            {test.status === "Published" ? (

              <div className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-100 px-5 py-3 text-sm font-semibold text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />

                Published
              </div>

            ) : (

              <button
                type="button"
                onClick={handlePublish}
                disabled={publishing}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {publishing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />

                    Publishing...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />

                    Publish Test
                  </>
                )}

              </button>

            )}

          </div>

        </div>

      </header>

      {/* ==================================================== */}
      {/* MAIN */}
      {/* ==================================================== */}

      <main className="mx-auto max-w-6xl px-6 py-8">

        {/* ================================================== */}
        {/* PUBLISH SUCCESS */}
        {/* ================================================== */}

        {publishSuccess && (
          <div className="mb-8 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-700">

            <CheckCircle2 className="h-5 w-5 shrink-0" />

            <div>

              <p className="font-semibold">
                Test published successfully.
              </p>

              <p className="mt-1 text-sm">
                This test is now available as a published assessment.
              </p>

            </div>

          </div>
        )}

        {/* ================================================== */}
        {/* PUBLISH ERROR */}
        {/* ================================================== */}

        {error && test && (
          <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">

            <p className="font-semibold">
              Unable to publish test.
            </p>

            <p className="mt-1 text-sm">
              {error}
            </p>

          </div>
        )}

        {/* ================================================== */}
        {/* SUMMARY */}
        {/* ================================================== */}

        <div className="mb-8 grid gap-4 sm:grid-cols-3">

          {/* QUESTIONS */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-4">

              <div className="rounded-xl bg-indigo-50 p-3">
                <FileText className="h-5 w-5 text-indigo-600" />
              </div>

              <div>

                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Questions
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {test.total_questions ??
                    questions.length}
                </p>

              </div>

            </div>

          </div>

          {/* MARKS */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-4">

              <div className="rounded-xl bg-emerald-50 p-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>

              <div>

                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Total Marks
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {test.total_marks ??
                    0}
                </p>

              </div>

            </div>

          </div>

          {/* DURATION */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-4">

              <div className="rounded-xl bg-amber-50 p-3">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>

              <div>

                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Duration
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {test.duration_minutes ??
                    0}{" "}
                  min
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* ================================================== */}
        {/* ACADEMIC CONTEXT */}
        {/* ================================================== */}

        {(test.chapter_id ||
          test.topic_id) && (

          <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              Academic Context
            </h2>

            <div className="mt-4 flex flex-wrap gap-3">

              {test.chapter_id && (
                <span className="rounded-lg bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
                  Chapter ID:{" "}
                  {test.chapter_id}
                </span>
              )}

              {test.topic_id && (
                <span className="rounded-lg bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700">
                  Topic ID:{" "}
                  {test.topic_id}
                </span>
              )}

            </div>

          </div>

        )}

        {/* ================================================== */}
        {/* QUESTIONS HEADER */}
        {/* ================================================== */}

        <div className="mb-5 flex items-center justify-between">

          <div>

            <h2 className="text-2xl font-bold text-slate-900">
              Questions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review the questions before publishing.
            </p>

          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-600">
            {questions.length}{" "}
            Questions
          </span>

        </div>

        {/* ================================================== */}
        {/* QUESTION LIST */}
        {/* ================================================== */}

        <div className="space-y-6">

          {questions.length === 0 ? (

            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">

              <FileText className="mx-auto h-10 w-10 text-slate-300" />

              <h3 className="mt-4 text-lg font-semibold text-slate-800">
                No questions found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                This test does not have any questions linked to it.
              </p>

            </div>

          ) : (

            questions.map(
              (testQuestion) => {

                const question =
                  testQuestion.questions;

                if (!question) {
                  return null;
                }

                const isAnswerVisible =
                  Boolean(
                    visibleAnswers[
                      question.id
                    ]
                  );

                return (
                  <article
                    key={
                      testQuestion.id
                    }
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                  >

                    {/* QUESTION HEADER */}

                    <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">

                      <div className="flex flex-wrap items-center justify-between gap-3">

                        <div className="flex items-center gap-3">

                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                            {
                              testQuestion.question_order
                            }
                          </span>

                          <span className="text-sm font-semibold text-slate-700">
                            Question{" "}
                            {
                              testQuestion.question_order
                            }
                          </span>

                        </div>

                        <div className="flex items-center gap-2">

                          {question.difficulty && (
                            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                              {question.difficulty}
                            </span>
                          )}

                          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
                            {testQuestion.marks ??
                              question.marks ??
                              0}{" "}
                            Marks
                          </span>

                        </div>

                      </div>

                    </div>

                    {/* QUESTION BODY */}

                    <div className="p-6">

                      <h3 className="text-lg font-semibold leading-8 text-slate-900">
                        {question.question_text}
                      </h3>

                      {/* OPTIONS */}

                      <div className="mt-6 grid gap-3 md:grid-cols-2">

                        <Option
                          label="A"
                          text={
                            question.option_a
                          }
                        />

                        <Option
                          label="B"
                          text={
                            question.option_b
                          }
                        />

                        <Option
                          label="C"
                          text={
                            question.option_c
                          }
                        />

                        <Option
                          label="D"
                          text={
                            question.option_d
                          }
                        />

                        {question.option_e && (
                          <Option
                            label="E"
                            text={
                              question.option_e
                            }
                          />
                        )}

                      </div>

                      {/* ANSWER TOGGLE */}

                      <div className="mt-6 border-t border-slate-100 pt-5">

                        <button
                          type="button"
                          onClick={() =>
                            toggleAnswer(
                              question.id
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
                        >

                          {isAnswerVisible ? (
                            <>
                              <EyeOff className="h-4 w-4" />

                              Hide Answer & Explanation
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4" />

                              Show Answer & Explanation
                            </>
                          )}

                        </button>

                      </div>

                      {/* ANSWER */}

                      {isAnswerVisible && (

                        <div className="mt-5 space-y-4">

                          {/* CORRECT ANSWER */}

                          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">

                            <p className="text-sm font-semibold text-emerald-800">
                              Correct Answer
                            </p>

                            <p className="mt-2 text-sm font-medium text-emerald-700">
                              {question.correct_answer ??
                                "Not specified"}
                            </p>

                          </div>

                          {/* EXPLANATION */}

                          {question.explanation && (
                            <div className="rounded-xl bg-slate-50 p-5">

                              <p className="text-sm font-semibold text-slate-800">
                                Explanation
                              </p>

                              <p className="mt-2 text-sm leading-7 text-slate-600">
                                {
                                  question.explanation
                                }
                              </p>

                            </div>
                          )}

                          {/* HINT */}

                          {question.hint && (
                            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">

                              <p className="text-sm font-semibold text-amber-800">
                                Hint
                              </p>

                              <p className="mt-2 text-sm leading-7 text-amber-700">
                                {
                                  question.hint
                                }
                              </p>

                            </div>
                          )}

                        </div>

                      )}

                    </div>

                  </article>
                );
              }
            )

          )}

        </div>

        {/* ================================================== */}
        {/* FOOTER ACTIONS */}
        {/* ================================================== */}

        <div className="mt-10 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">

          {/* BACK */}

          <button
            type="button"
            onClick={() =>
              router.push(
                "/repository/tests"
              )
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >

            <ArrowLeft className="h-4 w-4" />

            Back to Repository

          </button>

          {/* PUBLISH */}

          {test.status !== "Published" && (

            <button
              type="button"
              onClick={handlePublish}
              disabled={publishing}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {publishing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />

                  Publishing...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />

                  Publish Test
                </>
              )}

            </button>

          )}

        </div>

      </main>

    </div>
  );
}

// ============================================================
// OPTION COMPONENT
// ============================================================

function Option({
  label,
  text,
}: {
  label: string;
  text: string | null;
}) {
  if (!text) {
    return null;
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-indigo-200 hover:bg-slate-50">

      <div className="flex items-start gap-3">

        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-700">
          {label}
        </span>

        <span className="pt-0.5 text-sm leading-6 text-slate-700">
          {text}
        </span>

      </div>

    </div>
  );
}