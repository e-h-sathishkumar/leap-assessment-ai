"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Edit3,
  Eye,
  FileText,
  Loader2,
  RefreshCw,
  Rocket,
  Search,
  Sparkles,
  XCircle,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

interface Test {
  id: number;
  title: string;
  exam: string | null;
  class_name: string | null;

  subject_id: number | null;
  chapter_id: number | null;
  topic_id: number | null;

  duration_minutes: number | null;
  total_marks: number | null;
  total_questions: number | null;

  negative_marks: number | null;
  question_type: string | null;
  difficulty: string | null;

  status: string | null;
  is_active: boolean | null;

  start_time: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface Subject {
  id: number;
  name: string;
  code: string | null;
}

interface Chapter {
  id: number;
  name: string;
}

interface Topic {
  id: number;
  name: string;
}

type TestWithNames = Test & {
  subject_name: string;
  chapter_name: string;
  topic_name: string;
};

export default function PublishTestsPage() {
  const [tests, setTests] = useState<TestWithNames[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(
    null
  );

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<
    "draft" | "published"
  >("draft");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ==========================================================
     LOAD TESTS
  ========================================================== */

  async function loadTests() {
    try {
      setLoading(true);
      setError("");

      const { data, error: testsError } = await supabase
        .from("tests")
        .select(`
          id,
          title,
          exam,
          class_name,
          subject_id,
          chapter_id,
          topic_id,
          duration_minutes,
          total_marks,
          total_questions,
          negative_marks,
          question_type,
          difficulty,
          status,
          is_active,
          start_time,
          created_at,
          updated_at
        `)
        .order("created_at", {
          ascending: false,
        });

      if (testsError) {
        throw testsError;
      }

      const rawTests = (data || []) as Test[];

      /* --------------------------------------------------------
         LOAD SUBJECTS
      -------------------------------------------------------- */

      const { data: subjects, error: subjectsError } =
        await supabase
          .from("subjects")
          .select("id, name, code");

      if (subjectsError) {
        throw subjectsError;
      }

      /* --------------------------------------------------------
         LOAD CHAPTERS
      -------------------------------------------------------- */

      const { data: chapters, error: chaptersError } =
        await supabase
          .from("chapters")
          .select("id, name");

      if (chaptersError) {
        throw chaptersError;
      }

      /* --------------------------------------------------------
         LOAD TOPICS
      -------------------------------------------------------- */

      const { data: topics, error: topicsError } =
        await supabase
          .from("topics")
          .select("id, name");

      if (topicsError) {
        throw topicsError;
      }

      const subjectMap = new Map<number, Subject>();
      const chapterMap = new Map<number, Chapter>();
      const topicMap = new Map<number, Topic>();

      (subjects || []).forEach((subject) => {
        subjectMap.set(subject.id, subject);
      });

      (chapters || []).forEach((chapter) => {
        chapterMap.set(chapter.id, chapter);
      });

      (topics || []).forEach((topic) => {
        topicMap.set(topic.id, topic);
      });

      const enriched: TestWithNames[] = rawTests.map(
        (test) => ({
          ...test,

          subject_name:
            subjectMap.get(test.subject_id || 0)?.name ||
            "Subject not selected",

          chapter_name:
            chapterMap.get(test.chapter_id || 0)?.name ||
            "Chapter not selected",

          topic_name:
            topicMap.get(test.topic_id || 0)?.name ||
            "Topic not selected",
        })
      );

      setTests(enriched);
    } catch (err) {
      console.error("LOAD PUBLISH TESTS ERROR:", err);

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

  /* ==========================================================
     PUBLISH
  ========================================================== */

  async function publishTest(test: TestWithNames) {
    const confirmed = window.confirm(
      `Publish "${test.title}"?\n\nOnce published, this assessment will be available as a published test.`
    );

    if (!confirmed) return;

    try {
      setActionLoading(test.id);
      setError("");
      setSuccess("");

      const { error: updateError } = await supabase
        .from("tests")
        .update({
          status: "Published",
          is_active: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", test.id);

      if (updateError) {
        throw updateError;
      }

      setTests((current) =>
        current.map((item) =>
          item.id === test.id
            ? {
                ...item,
                status: "Published",
                is_active: true,
              }
            : item
        )
      );

      setSuccess(
        `"${test.title}" has been published successfully.`
      );
    } catch (err) {
      console.error("PUBLISH ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to publish test."
      );
    } finally {
      setActionLoading(null);
    }
  }

  /* ==========================================================
     UNPUBLISH
  ========================================================== */

  async function unpublishTest(test: TestWithNames) {
    const confirmed = window.confirm(
      `Unpublish "${test.title}"?\n\nThe test will return to Draft status.`
    );

    if (!confirmed) return;

    try {
      setActionLoading(test.id);
      setError("");
      setSuccess("");

      const { error: updateError } = await supabase
        .from("tests")
        .update({
          status: "Draft",
          is_active: false,
          updated_at: new Date().toISOString(),
        })
        .eq("id", test.id);

      if (updateError) {
        throw updateError;
      }

      setTests((current) =>
        current.map((item) =>
          item.id === test.id
            ? {
                ...item,
                status: "Draft",
                is_active: false,
              }
            : item
        )
      );

      setSuccess(
        `"${test.title}" has been moved back to Draft.`
      );
    } catch (err) {
      console.error("UNPUBLISH ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to unpublish test."
      );
    } finally {
      setActionLoading(null);
    }
  }

  /* ==========================================================
     FILTER
  ========================================================== */

  const filteredTests = useMemo(() => {
    const value = search.trim().toLowerCase();

    return tests.filter((test) => {
      const status = (
        test.status || "Draft"
      ).toLowerCase();

      const isPublished =
        status === "published";

      const matchesTab =
        activeTab === "published"
          ? isPublished
          : !isPublished;

      if (!matchesTab) {
        return false;
      }

      if (!value) {
        return true;
      }

      return (
        test.title
          ?.toLowerCase()
          .includes(value) ||
        test.exam
          ?.toLowerCase()
          .includes(value) ||
        test.class_name
          ?.toLowerCase()
          .includes(value) ||
        test.subject_name
          .toLowerCase()
          .includes(value) ||
        test.chapter_name
          .toLowerCase()
          .includes(value) ||
        test.topic_name
          .toLowerCase()
          .includes(value)
      );
    });
  }, [tests, activeTab, search]);

  const draftCount = tests.filter(
    (test) =>
      (test.status || "Draft").toLowerCase() !==
      "published"
  ).length;

  const publishedCount = tests.filter(
    (test) =>
      (test.status || "").toLowerCase() ===
      "published"
  ).length;

  /* ==========================================================
     LOADING
  ========================================================== */

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <Header />

        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />

            <p className="text-sm text-slate-500">
              Loading saved tests...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /* ==========================================================
     PAGE
  ========================================================== */

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <Header />

      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* ====================================================
            PAGE TITLE
        ==================================================== */}

        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

          <div>
            <div className="mb-3 flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
                <Rocket className="h-6 w-6" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Teacher Workspace
                </p>

                <h1 className="text-3xl font-bold text-slate-900">
                  Publish Tests
                </h1>
              </div>

            </div>

            <p className="max-w-2xl text-sm text-slate-500">
              Review completed assessments, make final changes,
              and publish them for students.
            </p>
          </div>

          <Link
            href="/teacher/assessment"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            <Sparkles className="h-4 w-4" />
            Create New Test
          </Link>

        </div>

        {/* ====================================================
            ALERTS
        ==================================================== */}

        {error && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              {error}
            </div>

            <button
              type="button"
              onClick={() => setError("")}
            >
              <XCircle className="h-4 w-4" />
            </button>

          </div>
        )}

        {success && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">

            <CheckCircle2 className="h-4 w-4" />

            {success}

          </div>
        )}

        {/* ====================================================
            SUMMARY
        ==================================================== */}

        <div className="mb-6 grid gap-4 md:grid-cols-3">

          <SummaryCard
            icon={<FileText className="h-5 w-5" />}
            label="Total Tests"
            value={String(tests.length)}
          />

          <SummaryCard
            icon={<Clock className="h-5 w-5" />}
            label="Draft Tests"
            value={String(draftCount)}
          />

          <SummaryCard
            icon={
              <CheckCircle2 className="h-5 w-5" />
            }
            label="Published"
            value={String(publishedCount)}
          />

        </div>

        {/* ====================================================
            TABS + SEARCH
        ==================================================== */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex rounded-xl bg-slate-100 p-1">

              <button
                type="button"
                onClick={() =>
                  setActiveTab("draft")
                }
                className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                  activeTab === "draft"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                Draft Tests
                <span className="ml-2 rounded-md bg-amber-50 px-2 py-0.5 text-[10px] text-amber-700">
                  {draftCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setActiveTab("published")
                }
                className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                  activeTab === "published"
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                Published
                <span className="ml-2 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700">
                  {publishedCount}
                </span>
              </button>

            </div>

            <div className="flex gap-3">

              <div className="relative min-w-0 flex-1 lg:w-80">

                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search tests..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-10 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white"
                />

              </div>

              <button
                type="button"
                onClick={loadTests}
                className="flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-slate-600 hover:bg-slate-50"
                title="Refresh"
              >
                <RefreshCw className="h-4 w-4" />
              </button>

            </div>

          </div>

        </div>

        {/* ====================================================
            TEST LIST
        ==================================================== */}

        {filteredTests.length === 0 ? (
          <EmptyState
            published={
              activeTab === "published"
            }
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {filteredTests.map((test) => (
              <TestCard
                key={test.id}
                test={test}
                actionLoading={
                  actionLoading === test.id
                }
                onPublish={() =>
                  publishTest(test)
                }
                onUnpublish={() =>
                  unpublishTest(test)
                }
              />
            ))}

          </div>
        )}

      </div>
    </main>
  );
}

/* ============================================================
   HEADER
============================================================ */

function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

        <Link
          href="/teacher/dashboard"
          className="flex items-center gap-3"
        >

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
            <BookOpen className="h-5 w-5" />
          </div>

          <div>
            <p className="text-lg font-bold text-slate-900">
              LEAP Assessment AI
            </p>

            <p className="text-xs text-slate-500">
              Teacher • Publish Tests
            </p>
          </div>

        </Link>

        <Link
          href="/teacher/dashboard"
          className="text-sm font-medium text-slate-500 hover:text-blue-600"
        >
          Teacher Dashboard
        </Link>

      </div>

    </header>
  );
}

/* ============================================================
   TEST CARD
============================================================ */

function TestCard({
  test,
  actionLoading,
  onPublish,
  onUnpublish,
}: {
  test: TestWithNames;
  actionLoading: boolean;
  onPublish: () => void;
  onUnpublish: () => void;
}) {
  const published =
    (test.status || "").toLowerCase() ===
    "published";

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

      {/* TOP */}

      <div className="p-5">

        <div className="mb-4 flex items-center justify-between">

          <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-blue-700">
            {test.exam || "Assessment"}
          </span>

          {published ? (
            <span className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-emerald-700">
              <CheckCircle2 className="h-3 w-3" />
              Published
            </span>
          ) : (
            <span className="rounded-lg bg-amber-50 px-3 py-1.5 text-[10px] font-bold text-amber-700">
              Draft
            </span>
          )}

        </div>

        {/* TITLE */}

        <h2 className="line-clamp-2 text-xl font-bold text-slate-900">
          {test.title || "Untitled Test"}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {test.class_name || "Class not specified"}
        </p>

        {/* ACADEMIC SCOPE */}

        <div className="mt-4 space-y-2">

          <ScopeRow
            label="Subject"
            value={test.subject_name}
          />

          <ScopeRow
            label="Chapter"
            value={test.chapter_name}
          />

          <ScopeRow
            label="Topic"
            value={test.topic_name}
          />

        </div>

        {/* STATS */}

        <div className="mt-5 grid grid-cols-3 gap-2">

          <Stat
            value={String(
              test.total_marks ?? 0
            )}
            label="Marks"
          />

          <Stat
            value={String(
              test.total_questions ?? 0
            )}
            label="Questions"
          />

          <Stat
            value={`${test.duration_minutes ?? 0}m`}
            label="Duration"
          />

        </div>

      </div>

      {/* ACTIONS */}

      <div className="border-t border-slate-100 bg-slate-50/70 p-4">

        <div className="grid grid-cols-2 gap-2">

          <Link
            href={`/repository/test/${test.id}`}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            {published ? (
              <>
                <Eye className="h-4 w-4" />
                View
              </>
            ) : (
              <>
                <Edit3 className="h-4 w-4" />
                Review & Edit
              </>
            )}
          </Link>

          {published ? (
            <button
              type="button"
              onClick={onUnpublish}
              disabled={actionLoading}
              className="flex items-center justify-center gap-2 rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-xs font-semibold text-amber-700 hover:bg-amber-50 disabled:opacity-50"
            >
              {actionLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}

              Unpublish
            </button>
          ) : (
            <button
              type="button"
              onClick={onPublish}
              disabled={actionLoading}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {actionLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Rocket className="h-4 w-4" />
              )}

              Publish
            </button>
          )}

        </div>

      </div>

    </div>
  );
}

/* ============================================================
   SCOPE ROW
============================================================ */

function ScopeRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3 text-xs">

      <span className="font-medium text-slate-400">
        {label}
      </span>

      <span className="text-right font-semibold text-slate-700">
        {value}
      </span>

    </div>
  );
}

/* ============================================================
   STAT
============================================================ */

function Stat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-3 text-center">

      <p className="text-sm font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-0.5 text-[10px] text-slate-400">
        {label}
      </p>

    </div>
  );
}

/* ============================================================
   SUMMARY CARD
============================================================ */

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>

      <div>

        <p className="text-xs font-medium text-slate-400">
          {label}
        </p>

        <p className="mt-1 text-2xl font-bold text-slate-900">
          {value}
        </p>

      </div>

    </div>
  );
}

/* ============================================================
   EMPTY STATE
============================================================ */

function EmptyState({
  published,
}: {
  published: boolean;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">

      {published ? (
        <CheckCircle2 className="mx-auto h-12 w-12 text-slate-300" />
      ) : (
        <FileText className="mx-auto h-12 w-12 text-slate-300" />
      )}

      <h2 className="mt-4 text-lg font-bold text-slate-700">
        {published
          ? "No published tests"
          : "No draft tests"}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
        {published
          ? "Tests that you publish will appear here."
          : "Completed tests waiting for review and publication will appear here."}
      </p>

      {!published && (
        <Link
          href="/teacher/assessment"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Sparkles className="h-4 w-4" />
          Create Test
        </Link>
      )}

    </div>
  );
}