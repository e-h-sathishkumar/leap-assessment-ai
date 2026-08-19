import { notFound } from "next/navigation";
import Link from "next/link";

import ChapterAnalysis from "@/components/online-test/ChapterAnalysis";
import { getAttemptByIdServer } from "@/services/server/test-result.service";
import PerformanceDashboard from "@/components/online-test/PerformanceDashboard";
import ResultHeader from "@/components/online-test/ResultHeader";
import ResultSummary from "@/components/online-test/ResultSummary";
import ResultNavigation from "@/components/online-test/ResultNavigation";
import ResultQuestionCard from "@/components/online-test/ResultQuestionCard";

interface PageProps {
  params: Promise<{
    id: string;
    attemptId: string;
  }>;
}

export default async function ResultPage({
  params,
}: PageProps) {
  const { id, attemptId } = await params;

  const attempt =
    await getAttemptByIdServer(attemptId);

  if (!attempt) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-100">

      {/* ==========================================
          PAGE CONTAINER
          ========================================== */}

      <div className="mx-auto w-full max-w-7xl px-6 py-6 lg:px-8">

        {/* ==========================================
            RESULT HEADER
            ========================================== */}

        <ResultHeader
          attempt={attempt}
          testId={id}
          attemptId={attemptId}
        />

        {/* ==========================================
            RESULT NAVIGATION
            ========================================== */}

        <div className="mt-4 flex flex-wrap gap-3">

          {/* DASHBOARD */}

          <Link
            href="/student/dashboard"
            className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            ← Back to Dashboard
          </Link>

          {/* MY RESULTS */}

          <Link
            href="/student/results"
            className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            My Results
          </Link>

        </div>

        {/* ==========================================
            RESULT SUMMARY
            ========================================== */}

        <div className="mt-6">

          <ResultSummary
            attempt={attempt}
          />

        </div>

        {/* ==========================================
            PERFORMANCE DASHBOARD
            ========================================== */}

        <div className="mt-6">

          <PerformanceDashboard
            attempt={attempt}
          />

        </div>

        {/* ==========================================
            CHAPTER ANALYSIS
            ========================================== */}

        <div className="mt-6">

          <ChapterAnalysis
            attempt={attempt}
          />

        </div>

        {/* ==========================================
            QUESTION NAVIGATION
            ========================================== */}

        <div className="mt-8">

          <ResultNavigation
            questions={
              attempt.tests.test_questions
            }
            attemptId={Number(attemptId)}
          />

        </div>

        {/* ==========================================
            QUESTION REVIEW
            ========================================== */}

        <div className="mt-12">

          <div className="mb-6">

            <h2 className="text-3xl font-bold text-slate-900">
              Question Review
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review your answers, correct answers,
              and explanations.
            </p>

          </div>

          {/* NO QUESTIONS */}

          {attempt.tests.test_questions.length === 0 ? (

            <div className="rounded-xl border bg-white p-8 text-center text-slate-500 shadow-sm">

              No questions found.

            </div>

          ) : (

            /* QUESTIONS */

            <div className="space-y-8">

              {attempt.tests.test_questions.map(
                (testQuestion: any) => (

                  <ResultQuestionCard
                    key={
                      testQuestion.question_order
                    }
                    testQuestion={testQuestion}
                    attemptId={Number(attemptId)}
                  />

                )
              )}

            </div>

          )}

        </div>

        {/* ==========================================
            BOTTOM NAVIGATION
            ========================================== */}

        <div className="mt-12 flex flex-wrap justify-center gap-3 border-t border-slate-200 pt-8">

          <Link
            href="/student/dashboard"
            className="inline-flex items-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            ← Student Dashboard
          </Link>

          <Link
            href="/student/results"
            className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            My Results
          </Link>

        </div>

      </div>

    </main>
  );
}