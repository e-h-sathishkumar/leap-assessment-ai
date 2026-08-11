"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Plus,
  Eye,
  Send,
  Trash2,
  RefreshCw,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

interface TestRecord {
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
  created_at: string;
}

interface SubjectRecord {
  id: number;
  name: string;
}

interface TestWithSubject
  extends TestRecord {
  subject?: SubjectRecord | null;
}

export default function RepositoryTestsPage() {
  const router = useRouter();

  const [tests, setTests] =
    useState<TestWithSubject[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  // ==========================================================
  // LOAD TESTS
  // ==========================================================

  async function loadTests() {
    try {
      setLoading(true);
      setError("");

      const {
        data,
        error: fetchError,
      } = await supabase
        .from("tests")
        .select(
          `
            id,
            title,
            exam,
            class_name,
            subject_id,
            chapter_id,
            topic_id,
            total_questions,
            total_marks,
            duration_minutes,
            status,
            created_at,
            subjects (
              id,
              name
            )
          `
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

      if (fetchError) {
        throw fetchError;
      }

      const normalized =
        (data ?? []).map(
          (test: any) => ({
            ...test,
            subject:
              Array.isArray(
                test.subjects
              )
                ? test.subjects[0] ??
                  null
                : test.subjects ??
                  null,
          })
        );

      setTests(
        normalized
      );

    } catch (err) {
      console.error(
        "Repository Tests Error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load tests."
      );

    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTests();
  }, []);

  // ==========================================================
  // DELETE TEST
  // ==========================================================

  async function handleDelete(
    testId: number
  ) {
    const confirmed =
      window.confirm(
        "Delete this test from the repository?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(testId);
      setError("");

      // ------------------------------------------------------
      // Remove relationships first
      // ------------------------------------------------------

      const {
        error:
          relationError,
      } = await supabase
        .from("test_questions")
        .delete()
        .eq(
          "test_id",
          testId
        );

      if (relationError) {
        throw relationError;
      }

      // ------------------------------------------------------
      // Remove test
      // ------------------------------------------------------

      const {
        error:
          deleteError,
      } = await supabase
        .from("tests")
        .delete()
        .eq(
          "id",
          testId
        );

      if (deleteError) {
        throw deleteError;
      }

      setTests(
        (current) =>
          current.filter(
            (test) =>
              test.id !==
              testId
          )
      );

    } catch (err) {
      console.error(
        "Delete Test Error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete test."
      );

    } finally {
      setDeletingId(null);
    }
  }

  // ==========================================================
  // PUBLISH TEST
  // ==========================================================

  async function handlePublish(
    testId: number
  ) {
    const confirmed =
      window.confirm(
        "Publish this test?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const {
        error:
          updateError,
      } = await supabase
        .from("tests")
        .update({
          status:
            "Published",
        })
        .eq(
          "id",
          testId
        );

      if (updateError) {
        throw updateError;
      }

      setTests(
        (current) =>
          current.map(
            (test) =>
              test.id === testId
                ? {
                    ...test,
                    status:
                      "Published",
                  }
                : test
          )
      );

    } catch (err) {
      console.error(
        "Publish Test Error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to publish test."
      );
    }
  }

  // ==========================================================
  // STATUS STYLE
  // ==========================================================

  function statusClass(
    status: string | null
  ) {
    switch (
      status?.toLowerCase()
    ) {
      case "published":
        return "bg-emerald-100 text-emerald-700";

      case "draft":
        return "bg-amber-100 text-amber-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  }

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="flex items-center gap-3 text-slate-600">
              <RefreshCw className="h-5 w-5 animate-spin" />
              Loading Test Repository...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">

      <div className="mx-auto max-w-7xl">

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>

            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              LEAP Repository
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Test Repository
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              Manage saved assessments and test papers.
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/teacher/assessment/create"
              )
            }
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
          >
            <Plus className="h-5 w-5" />
            Create Test
          </button>

        </div>

        {/* ================================================== */}
        {/* ERROR */}
        {/* ================================================== */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ================================================== */}
        {/* SUMMARY */}
        {/* ================================================== */}

        <div className="mb-6 grid gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <p className="text-sm text-slate-500">
              Total Tests
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {tests.length}
            </p>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <p className="text-sm text-slate-500">
              Draft Tests
            </p>

            <p className="mt-1 text-2xl font-bold text-amber-600">
              {
                tests.filter(
                  (test) =>
                    test.status?.toLowerCase() ===
                    "draft"
                ).length
              }
            </p>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <p className="text-sm text-slate-500">
              Published Tests
            </p>

            <p className="mt-1 text-2xl font-bold text-emerald-600">
              {
                tests.filter(
                  (test) =>
                    test.status?.toLowerCase() ===
                    "published"
                ).length
              }
            </p>

          </div>

        </div>

        {/* ================================================== */}
        {/* EMPTY STATE */}
        {/* ================================================== */}

        {tests.length === 0 ? (

          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-16 text-center">

            <FileText className="mx-auto h-12 w-12 text-slate-300" />

            <h2 className="mt-4 text-xl font-bold text-slate-800">
              No Tests in Repository
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Create an assessment to add your first test.
            </p>

          </div>

        ) : (

          /* ================================================= */
          /* TEST LIST */
          /* ================================================= */

          <div className="space-y-4">

            {tests.map(
              (test) => (

                <div
                  key={test.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md"
                >

                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                    {/* ====================================== */}
                    {/* TEST INFORMATION */}
                    {/* ====================================== */}

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-wrap items-center gap-2">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                            test.status
                          )}`}
                        >
                          {test.status ??
                            "Draft"}
                        </span>

                        {test.exam && (
                          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                            {test.exam}
                          </span>
                        )}

                        {test.class_name && (
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                            Class{" "}
                            {test.class_name}
                          </span>
                        )}

                      </div>

                      <h2 className="mt-3 text-xl font-bold text-slate-900">
                        {test.title ??
                          `Test #${test.id}`}
                      </h2>

                      <p className="mt-1 text-sm text-slate-600">
                        {test.subject?.name ??
                          "Subject"}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">

                        <span className="flex items-center gap-1.5">
                          <FileText className="h-4 w-4" />
                          {test.total_questions ??
                            0}{" "}
                          Questions
                        </span>

                        <span>
                          {test.total_marks ??
                            0}{" "}
                          Marks
                        </span>

                        <span>
                          {test.duration_minutes ??
                            0}{" "}
                          Minutes
                        </span>

                        <span>
                          Test #{test.id}
                        </span>

                      </div>

                    </div>

                    {/* ====================================== */}
                    {/* ACTIONS */}
                    {/* ====================================== */}

                    <div className="flex flex-wrap gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          router.push(
                            `/repository/tests/${test.id}`
                          )
                        }
                        className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </button>

                      {test.status?.toLowerCase() ===
                        "draft" && (

                        <button
                          type="button"
                          onClick={() =>
                            handlePublish(
                              test.id
                            )
                          }
                          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                        >
                          <Send className="h-4 w-4" />
                          Publish
                        </button>

                      )}

                      <button
                        type="button"
                        disabled={
                          deletingId ===
                          test.id
                        }
                        onClick={() =>
                          handleDelete(
                            test.id
                          )
                        }
                        className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        {deletingId ===
                        test.id ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}

                        Delete
                      </button>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>
  );
}