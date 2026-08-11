"use client";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Brain,
  ClipboardCheck,
  BarChart3,
  Trophy,
  Clock,
  FileText,
  Play,
  LogOut,
  Loader2,
  UserCircle,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";

import {
  currentUser,
  logout,
} from "@/services/auth/auth.service";

import {
  getPublishedTests,
  getStudentTestAttempts,
} from "@/services/test.service";

interface PublishedTest {
  id: number;
  title: string;
  total_questions?: number;
  duration_minutes?: number;
  duration?: number;
  status?: string;

  subjects?: {
    id: number;
    name: string;
  } | null;
}

interface TestAttempt {
  id: number;
  test_id: number;
  student_id: string;
  started_at: string;
  submitted_at?: string | null;
  status: string;
  score?: number | null;
  percentage?: number | null;
  accuracy?: number | null;
  correct?: number | null;
  wrong?: number | null;
  skipped?: number | null;
  attempted?: number | null;
}

interface TestWithAttempt
  extends PublishedTest {
  attempt?: TestAttempt;
}

// =====================================================
// STUDENT DASHBOARD
// =====================================================

export default function StudentPortalPage() {
  const router = useRouter();

  const [student, setStudent] =
    useState<any>(null);

  const [tests, setTests] =
    useState<PublishedTest[]>([]);

  const [attempts, setAttempts] =
    useState<TestAttempt[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [loadingTests, setLoadingTests] =
    useState(true);

  const [error, setError] =
    useState("");

  // =====================================================
  // LOAD STUDENT
  // =====================================================

  useEffect(() => {
    async function loadStudent() {
      try {
        setLoading(true);
        setError("");

        const {
          data: { user },
          error: authError,
        } = await currentUser();

        if (
          authError ||
          !user
        ) {
          router.replace(
            "/student/login"
          );

          return;
        }

        // -------------------------------------------------
        // Get profile directly
        // -------------------------------------------------

        const {
          data: profile,
          error: profileError,
        } = await (
          await fetch(
            "/api/student/profile"
          )
        ).json();

        if (
          !profileError &&
          profile
        ) {
          setStudent({
            ...profile,
            id:
              profile.id ??
              user.id,
          });
        } else {
          setStudent({
            id: user.id,
            email:
              user.email ?? "",
            full_name:
              user.user_metadata
                ?.full_name ??
              user.email ??
              "Student",
            role: "student",
          });
        }

      } catch (err) {
        console.error(
          "LOAD STUDENT ERROR:",
          err
        );

        router.replace(
          "/student/login"
        );
      } finally {
        setLoading(false);
      }
    }

    loadStudent();
  }, [router]);

  // =====================================================
  // LOAD TESTS + ATTEMPTS
  // =====================================================

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoadingTests(true);
        setError("");

        const {
          data: { user },
          error: authError,
        } = await currentUser();

        if (
          authError ||
          !user
        ) {
          router.replace(
            "/student/login"
          );

          return;
        }

        // -------------------------------------------------
        // Published tests
        // -------------------------------------------------

        const publishedTests =
          await getPublishedTests();

        // -------------------------------------------------
        // This student's attempts only
        // -------------------------------------------------

        const studentAttempts =
          await getStudentTestAttempts(
            user.id
          );

        setTests(
          (publishedTests ??
            []) as PublishedTest[]
        );

        setAttempts(
          (studentAttempts ??
            []) as TestAttempt[]
        );

        console.log(
          "========== STUDENT DASHBOARD =========="
        );

        console.log(
          "Student ID:",
          user.id
        );

        console.log(
          "Published Tests:",
          publishedTests
        );

        console.log(
          "Student Attempts:",
          studentAttempts
        );

        console.log(
          "========================================"
        );

      } catch (err) {
        console.error(
          "LOAD DASHBOARD DATA ERROR:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load assessments."
        );
      } finally {
        setLoadingTests(false);
      }
    }

    loadDashboardData();
  }, [router]);

  // =====================================================
  // LOGOUT
  // =====================================================

  async function handleLogout() {
    try {
      await logout();

      router.replace("/");
      router.refresh();

    } catch (err) {
      console.error(
        "LOGOUT ERROR:",
        err
      );
    }
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">

        <div className="text-center">

          <Loader2
            className="mx-auto animate-spin text-green-600"
            size={40}
          />

          <p className="mt-4 text-slate-600">
            Loading student portal...
          </p>

        </div>

      </main>
    );
  }

  // =====================================================
  // CALCULATE TEST LIFECYCLE
  // =====================================================

  const latestAttemptByTest =
    new Map<number, TestAttempt>();

  for (const attempt of attempts) {
    if (
      !latestAttemptByTest.has(
        Number(attempt.test_id)
      )
    ) {
      latestAttemptByTest.set(
        Number(attempt.test_id),
        attempt
      );
    }
  }

  const availableTests: PublishedTest[] =
    [];

  const inProgressTests: TestWithAttempt[] =
    [];

  const completedTests: TestWithAttempt[] =
    [];

  for (const test of tests) {
    const attempt =
      latestAttemptByTest.get(
        Number(test.id)
      );

    if (!attempt) {
      // -----------------------------------------------
      // Never attempted
      // -----------------------------------------------

      availableTests.push(test);

      continue;
    }

    const status =
      String(
        attempt.status ?? ""
      ).toLowerCase();

    if (
      status === "completed" ||
      status === "submitted"
    ) {
      // -----------------------------------------------
      // Completed
      // -----------------------------------------------

      completedTests.push({
        ...test,
        attempt,
      });

    } else {
      // -----------------------------------------------
      // In Progress
      // -----------------------------------------------

      inProgressTests.push({
        ...test,
        attempt,
      });
    }
  }

  // =====================================================
  // STATISTICS
  // =====================================================

  const completedCount =
    completedTests.length;

  const inProgressCount =
    inProgressTests.length;

  const availableCount =
    availableTests.length;

  const averagePercentage =
    completedTests.length === 0
      ? 0
      : completedTests.reduce(
          (sum, item) =>
            sum +
            Number(
              item.attempt
                ?.percentage ?? 0
            ),
          0
        ) /
        completedTests.length;

  // =====================================================
  // DASHBOARD
  // =====================================================

  return (
    <main className="min-h-screen bg-slate-50">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
              <UserCircle size={28} />
            </div>

            <div>

              <p className="text-sm text-slate-500">
                Welcome back
              </p>

              <h1 className="text-xl font-bold text-slate-900">
                {student?.full_name ??
                  student?.email ??
                  "Student"}
              </h1>

            </div>

          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            <LogOut size={18} />

            Logout
          </button>

        </div>

      </header>

      {/* =================================================
          HERO
      ================================================= */}

      <section className="bg-gradient-to-br from-green-700 via-emerald-700 to-teal-800 text-white">

        <div className="mx-auto max-w-7xl px-6 py-12">

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-green-100 hover:text-white"
          >
            <ArrowLeft size={18} />

            Back to Home
          </Link>

          <div className="mt-8">

            <h2 className="text-4xl font-extrabold">
              Student Dashboard
            </h2>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-green-100">
              Take assessments, resume unfinished
              tests and review your performance.
            </p>

          </div>

        </div>

      </section>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="mx-auto mt-6 max-w-7xl px-6">

          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
            {error}
          </div>

        </div>
      )}

      {/* =================================================
          STATISTICS
      ================================================= */}

      <section className="mx-auto max-w-7xl px-6 pt-10">

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            title="Available"
            value={availableCount}
            icon={
              <ClipboardCheck
                size={24}
              />
            }
          />

          <StatCard
            title="In Progress"
            value={inProgressCount}
            icon={
              <Clock size={24} />
            }
          />

          <StatCard
            title="Completed"
            value={completedCount}
            icon={
              <CheckCircle2
                size={24}
              />
            }
          />

          <StatCard
            title="Average Score"
            value={`${averagePercentage.toFixed(
              1
            )}%`}
            icon={
              <Trophy size={24} />
            }
          />

        </div>

      </section>

      {/* =================================================
          AVAILABLE TESTS
      ================================================= */}

      <section className="mx-auto max-w-7xl px-6 py-12">

        <div className="mb-8">

          <h2 className="text-3xl font-bold text-slate-900">
            Available Assessments
          </h2>

          <p className="mt-2 text-slate-500">
            Tests you have not attempted yet.
          </p>

        </div>

        {loadingTests && (
          <LoadingBox
            message="Loading assessments..."
          />
        )}

        {!loadingTests &&
          availableTests.length === 0 && (
            <EmptyBox
              icon={
                <ClipboardCheck
                  size={48}
                />
              }
              title="No New Assessments"
              description="You have attempted all currently published assessments."
            />
          )}

        {!loadingTests &&
          availableTests.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

              {availableTests.map(
                (test) => (
                  <TestCard
                    key={test.id}
                    test={test}
                    actionText="Start Test"
                    href={`/online-test/${test.id}/instructions`}
                    icon={
                      <Play
                        size={19}
                        fill="currentColor"
                      />
                    }
                  />
                )
              )}

            </div>
          )}

      </section>

      {/* =================================================
          IN PROGRESS
      ================================================= */}

      {inProgressTests.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-12">

          <div className="mb-8">

            <h2 className="text-3xl font-bold text-slate-900">
              Continue Your Tests
            </h2>

            <p className="mt-2 text-slate-500">
              You have started these assessments.
              Continue where you left off.
            </p>

          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {inProgressTests.map(
              (item) => (
                <TestCard
                  key={item.id}
                  test={item}
                  actionText="Resume Test"
                  href={`/online-test/${item.id}/attempt/${item.attempt?.id}`}
                  icon={
                    <RotateCcw
                      size={19}
                    />
                  }
                  badge="In Progress"
                />
              )
            )}

          </div>

        </section>
      )}

      {/* =================================================
          COMPLETED TESTS
      ================================================= */}

      <section className="mx-auto max-w-7xl px-6 pb-16">

        <div className="mb-8">

          <h2 className="text-3xl font-bold text-slate-900">
            My Results
          </h2>

          <p className="mt-2 text-slate-500">
            Review your completed assessments.
          </p>

        </div>

        {!loadingTests &&
          completedTests.length === 0 && (
            <EmptyBox
              icon={
                <BarChart3
                  size={48}
                />
              }
              title="No Results Yet"
              description="Your completed assessments will appear here."
            />
          )}

        {!loadingTests &&
          completedTests.length > 0 && (
            <div className="space-y-4">

              {completedTests.map(
                (item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between"
                  >

                    <div>

                      <p className="text-sm font-medium text-green-600">
                        {item.subjects?.name ??
                          "Assessment"}
                      </p>

                      <h3 className="mt-1 text-xl font-bold text-slate-900">
                        {item.title}
                      </h3>

                      <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">

                        <span>
                          Score:{" "}
                          <strong className="text-slate-800">
                            {Number(
                              item.attempt
                                ?.percentage ??
                                0
                            ).toFixed(
                              2
                            )}
                            %
                          </strong>
                        </span>

                        <span>
                          Accuracy:{" "}
                          <strong className="text-slate-800">
                            {Number(
                              item.attempt
                                ?.accuracy ??
                                0
                            ).toFixed(
                              2
                            )}
                            %
                          </strong>
                        </span>

                        <span>
                          Correct:{" "}
                          <strong className="text-green-600">
                            {item.attempt
                              ?.correct ??
                              0}
                          </strong>
                        </span>

                        <span>
                          Wrong:{" "}
                          <strong className="text-red-600">
                            {item.attempt
                              ?.wrong ??
                              0}
                          </strong>
                        </span>

                      </div>

                    </div>

                    <Link
                      href={`/online-test/${item.id}/result/${item.attempt?.id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-green-600 px-6 py-3 font-semibold text-green-700 transition hover:bg-green-50"
                    >
                      <BarChart3
                        size={18}
                      />

                      View Result
                    </Link>

                  </div>
                )
              )}

            </div>
          )}

      </section>

    </main>
  );
}

// =====================================================
// TEST CARD
// =====================================================

function TestCard({
  test,
  actionText,
  href,
  icon,
  badge,
}: {
  test: PublishedTest;
  actionText: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">

      {/* Header */}

      <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">

        <div className="flex items-start justify-between gap-4">

          <div>

            <p className="text-sm font-medium text-green-100">
              {test.subjects?.name ??
                "Assessment"}
            </p>

            <h3 className="mt-2 text-2xl font-bold">
              {test.title}
            </h3>

          </div>

          <div className="rounded-full bg-white/20 p-3">
            <FileText size={24} />
          </div>

        </div>

      </div>

      {/* Body */}

      <div className="p-6">

        {badge && (
          <div className="mb-4 inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
            {badge}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">

          <InfoItem
            icon={
              <FileText
                size={18}
              />
            }
            label="Questions"
            value={
              test.total_questions ??
              0
            }
          />

          <InfoItem
            icon={
              <Clock size={18} />
            }
            label="Duration"
            value={`${test.duration_minutes ?? test.duration ?? 0} min`}
          />

        </div>

        <Link
          href={href}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
        >
          {icon}

          {actionText}
        </Link>

      </div>

    </div>
  );
}

// =====================================================
// STAT CARD
// =====================================================

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p className="mt-1 text-3xl font-bold text-slate-900">
            {value}
          </p>

        </div>

        <div className="rounded-xl bg-green-100 p-3 text-green-700">
          {icon}
        </div>

      </div>

    </div>
  );
}

// =====================================================
// INFO ITEM
// =====================================================

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">

      <div className="flex items-center gap-2">

        <span className="text-green-600">
          {icon}
        </span>

        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {label}
        </span>

      </div>

      <p className="mt-2 text-lg font-bold text-slate-800">
        {value}
      </p>

    </div>
  );
}

// =====================================================
// LOADING BOX
// =====================================================

function LoadingBox({
  message,
}: {
  message: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

      <Loader2
        className="mx-auto animate-spin text-green-600"
        size={36}
      />

      <p className="mt-4 text-slate-500">
        {message}
      </p>

    </div>
  );
}

// =====================================================
// EMPTY BOX
// =====================================================

function EmptyBox({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">

      <div className="mx-auto w-fit text-slate-300">
        {icon}
      </div>

      <h3 className="mt-5 text-xl font-bold text-slate-800">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-slate-500">
        {description}
      </p>

    </div>
  );
}