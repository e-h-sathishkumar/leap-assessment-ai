import { getStudentDashboardData } from "@/services/student-dashboard.service";
import LogoutButton from "@/components/auth/LogoutButton";
import Link from "next/link";

export default async function StudentDashboardPage() {
  const {
    availableTests,
    completedAttempts,
    statistics,
    analytics: dashboardAnalytics,
  } = await getStudentDashboardData();

  const analytics = {
    strongestSubject:
      dashboardAnalytics?.strongestSubject ?? null,

    weakestSubject:
      dashboardAnalytics?.weakestSubject ?? null,

    subjectPerformance:
      dashboardAnalytics?.subjectPerformance ?? [],

    recentPerformance:
      dashboardAnalytics?.recentPerformance ?? [],
  };

  return (
    <main className="min-h-screen bg-slate-100">

      {/* =====================================================
          GREEN HEADER
      ===================================================== */}

      <section className="bg-gradient-to-r from-emerald-700 to-green-600 text-white">

        <div className="mx-auto w-full max-w-[1500px] px-6 py-6 lg:px-8">

          <div className="flex items-center justify-between gap-6">

            {/* BRAND / TITLE */}

            <div>

              <p className="text-sm font-medium text-emerald-100">
                LEAP Assessment AI
              </p>

              <h1 className="mt-1 text-3xl font-bold">
                Student Dashboard
              </h1>

              <p className="mt-2 text-emerald-100">
                Welcome to your LEAP Assessment dashboard.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="mx-auto w-full max-w-[1500px] px-6 py-8 lg:px-8">

        {/* ===================================================
            STATISTICS
        =================================================== */}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Tests Available
            </p>

            <p className="mt-2 text-3xl font-bold text-emerald-600">
              {statistics.testsAvailable}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Tests Completed
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-800">
              {statistics.testsCompleted}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Average Score
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-800">
              {statistics.averageScore}%
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Average Accuracy
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-800">
              {statistics.averageAccuracy}%
            </p>
          </div>

        </div>

        {/* ===================================================
            PERFORMANCE OVERVIEW
        =================================================== */}

        <section className="mt-8">

          <div className="mb-5">
            <h2 className="text-2xl font-bold text-slate-900">
              Performance Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your overall assessment performance.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Correct Answers
              </p>

              <p className="mt-2 text-3xl font-bold text-emerald-600">
                {statistics.totalCorrect}
              </p>
            </div>

            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Wrong Answers
              </p>

              <p className="mt-2 text-3xl font-bold text-red-600">
                {statistics.totalWrong}
              </p>
            </div>

            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Skipped Questions
              </p>

              <p className="mt-2 text-3xl font-bold text-amber-600">
                {statistics.totalSkipped}
              </p>
            </div>

            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Average Test Time
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-800">
                {Math.floor(
                  statistics.averageDurationSeconds / 60
                )}
                m{" "}
                {statistics.averageDurationSeconds % 60}
                s
              </p>
            </div>

          </div>

        </section>

        {/* ===================================================
            SUBJECT INSIGHTS
        =================================================== */}

        <section className="mt-8">

          <div className="mb-5">
            <h2 className="text-2xl font-bold text-slate-900">
              Subject Insights
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Understand where you are performing well and where improvement is needed.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">

            {/* STRONGEST */}

            <div className="rounded-xl border bg-white p-6 shadow-sm">

              <p className="text-sm font-semibold text-emerald-600">
                Strongest Subject
              </p>

              {analytics.strongestSubject ? (
                <>
                  <h3 className="mt-2 text-2xl font-bold text-slate-900">
                    {analytics.strongestSubject.subject}
                  </h3>

                  <p className="mt-2 text-slate-500">
                    Average Score:{" "}
                    <span className="font-semibold text-slate-800">
                      {analytics.strongestSubject.averageScore}%
                    </span>
                  </p>

                  <p className="mt-1 text-slate-500">
                    Accuracy:{" "}
                    <span className="font-semibold text-slate-800">
                      {analytics.strongestSubject.averageAccuracy}%
                    </span>
                  </p>
                </>
              ) : (
                <p className="mt-2 text-slate-500">
                  Complete a test to generate subject insights.
                </p>
              )}

            </div>

            {/* NEEDS IMPROVEMENT */}

            <div className="rounded-xl border bg-white p-6 shadow-sm">

              <p className="text-sm font-semibold text-red-600">
                Needs Improvement
              </p>

              {analytics.weakestSubject ? (
                <>
                  <h3 className="mt-2 text-2xl font-bold text-slate-900">
                    {analytics.weakestSubject.subject}
                  </h3>

                  <p className="mt-2 text-slate-500">
                    Average Score:{" "}
                    <span className="font-semibold text-slate-800">
                      {analytics.weakestSubject.averageScore}%
                    </span>
                  </p>

                  <p className="mt-1 text-slate-500">
                    Accuracy:{" "}
                    <span className="font-semibold text-slate-800">
                      {analytics.weakestSubject.averageAccuracy}%
                    </span>
                  </p>
                </>
              ) : (
                <p className="mt-2 text-slate-500">
                  Complete a test to generate subject insights.
                </p>
              )}

            </div>

          </div>

        </section>

        {/* ===================================================
            SUBJECT-WISE PERFORMANCE
        =================================================== */}

        <section className="mt-8">

          <div className="mb-5">
            <h2 className="text-2xl font-bold text-slate-900">
              Subject-wise Performance
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your performance across different subjects.
            </p>
          </div>

          {analytics.subjectPerformance.length === 0 ? (

            <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
              <p className="text-slate-500">
                No subject performance data available yet.
              </p>
            </div>

          ) : (

            <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

              <div className="overflow-x-auto">

                <table className="w-full text-sm">

                  <thead className="bg-slate-50">

                    <tr>

                      <th className="px-5 py-4 text-left">
                        Subject
                      </th>

                      <th className="px-5 py-4 text-left">
                        Tests
                      </th>

                      <th className="px-5 py-4 text-left">
                        Avg. Score
                      </th>

                      <th className="px-5 py-4 text-left">
                        Accuracy
                      </th>

                      <th className="px-5 py-4 text-left">
                        Correct
                      </th>

                      <th className="px-5 py-4 text-left">
                        Wrong
                      </th>

                      <th className="px-5 py-4 text-left">
                        Skipped
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {analytics.subjectPerformance.map(
                      (subject) => (

                        <tr
                          key={subject.subject}
                          className="border-t"
                        >

                          <td className="px-5 py-4 font-semibold">
                            {subject.subject}
                          </td>

                          <td className="px-5 py-4">
                            {subject.tests}
                          </td>

                          <td className="px-5 py-4">
                            {subject.averageScore}%
                          </td>

                          <td className="px-5 py-4">
                            {subject.averageAccuracy}%
                          </td>

                          <td className="px-5 py-4 text-emerald-600">
                            {subject.correct}
                          </td>

                          <td className="px-5 py-4 text-red-600">
                            {subject.wrong}
                          </td>

                          <td className="px-5 py-4 text-amber-600">
                            {subject.skipped}
                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>

          )}

        </section>

        {/* ===================================================
            AVAILABLE TESTS
        =================================================== */}

        <section className="mt-10">

          <div className="mb-5 flex items-center justify-between">

            <div>

              <h2 className="text-2xl font-bold text-slate-900">
                Available Tests
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Select a test to view instructions and begin your assessment.
              </p>

            </div>

            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
              {statistics.testsAvailable} Available
            </span>

          </div>

          <div className="grid gap-5 lg:grid-cols-2">

            {availableTests.map((test: any) => (

              <div
                key={test.id}
                className="rounded-xl border bg-white p-6 shadow-sm"
              >

                <h3 className="text-xl font-bold text-slate-900">
                  {test.title}
                </h3>

                <div className="mt-4 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">

                  <div>
                    <p className="font-semibold text-slate-700">
                      Subject
                    </p>

                    <p className="mt-1 text-slate-500">
                      {test.subjects?.name ?? "-"}
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold text-slate-700">
                      Questions
                    </p>

                    <p className="mt-1 text-slate-500">
                      {test.total_questions ?? 0}
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold text-slate-700">
                      Duration
                    </p>

                    <p className="mt-1 text-slate-500">
                      {test.duration_minutes ?? 0} Minutes
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold text-slate-700">
                      Total Marks
                    </p>

                    <p className="mt-1 text-slate-500">
                      {test.total_marks ?? 0}
                    </p>
                  </div>

                </div>

                <Link
                  href={`/online-test/${test.id}/instructions`}
                  className="mt-5 inline-flex rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Start Test
                </Link>

              </div>

            ))}

          </div>

        </section>

        {/* ===================================================
            RECENT PERFORMANCE
        =================================================== */}

        <section className="mt-8">

          <div className="mb-5">

            <h2 className="text-2xl font-bold text-slate-900">
              Recent Performance
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your ten most recent completed assessments.
            </p>

          </div>

          {analytics.recentPerformance.length === 0 ? (

            <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
              <p className="text-slate-500">
                No recent performance data available.
              </p>
            </div>

          ) : (

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

              {analytics.recentPerformance.map(
                (attempt) => (

                  <div
                    key={attempt.attemptId}
                    className="rounded-xl border bg-white p-5 shadow-sm"
                  >

                    <div className="flex items-start justify-between gap-3">

                      <div>

                        <h3 className="font-bold text-slate-900">
                          {attempt.testTitle}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {attempt.subject}
                        </p>

                      </div>

                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        Completed
                      </span>

                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-4 text-sm">

                      <div>
                        <p className="text-slate-500">
                          Score
                        </p>

                        <p className="mt-1 font-bold">
                          {attempt.percentage}%
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-500">
                          Accuracy
                        </p>

                        <p className="mt-1 font-bold">
                          {attempt.accuracy}%
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-500">
                          Correct
                        </p>

                        <p className="mt-1 font-bold text-emerald-600">
                          {attempt.correct}
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-500">
                          Wrong
                        </p>

                        <p className="mt-1 font-bold text-red-600">
                          {attempt.wrong}
                        </p>
                      </div>

                    </div>

                    <Link
                      href={`/online-test/${attempt.testId}/result/${attempt.attemptId}`}
                      className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      View Result
                    </Link>

                  </div>

                )
              )}

            </div>

          )}

        </section>

        {/* ===================================================
            COMPLETED TESTS
        =================================================== */}

        <section className="mt-10">

          <div className="mb-5">

            <h2 className="text-2xl font-bold text-slate-900">
              Completed Tests
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your completed assessments and performance.
            </p>

          </div>

          {completedAttempts.length === 0 ? (

            <div className="rounded-xl border bg-white p-8 text-center shadow-sm">

              <p className="text-slate-500">
                No completed tests yet.
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Your completed assessments will appear here.
              </p>

            </div>

          ) : (

            <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

              <div className="overflow-x-auto">

                <table className="w-full text-sm">

                  <thead className="bg-slate-50">

                    <tr>

                      <th className="px-5 py-4 text-left">
                        Test
                      </th>

                      <th className="px-5 py-4 text-left">
                        Subject
                      </th>

                      <th className="px-5 py-4 text-left">
                        Score
                      </th>

                      <th className="px-5 py-4 text-left">
                        Accuracy
                      </th>

                      <th className="px-5 py-4 text-left">
                        Status
                      </th>

                      <th className="px-5 py-4 text-left">
                        Result
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {completedAttempts.map(
                      (attempt: any) => (

                        <tr
                          key={attempt.attemptId}
                          className="border-t"
                        >

                          <td className="px-5 py-4 font-semibold">
                            {attempt.tests?.title ?? "-"}
                          </td>

                          <td className="px-5 py-4">
                            {attempt.tests?.subjects?.name ?? "-"}
                          </td>

                          <td className="px-5 py-4">
                            {attempt.score ?? 0}
                            {" / "}
                            {attempt.tests?.total_marks ?? 0}
                          </td>

                          <td className="px-5 py-4">
                            {attempt.accuracy ?? 0}%
                          </td>

                          <td className="px-5 py-4">

                            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                              Completed
                            </span>

                          </td>

                          <td className="px-5 py-4">

                            <Link
                              href={`/online-test/${attempt.test_id}/result/${attempt.id}`}
                              className="font-semibold text-blue-600 hover:text-blue-800"
                            >
                              View Result
                            </Link>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>

          )}

        </section>

      </div>

    </main>
  );
}
