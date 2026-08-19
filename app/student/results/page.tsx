import { getStudentDashboardData } from "@/services/student-dashboard.service";
import Link from "next/link";

export default async function StudentResultsPage() {
  const { completedAttempts } =
    await getStudentDashboardData();

  return (
    <main className="min-h-screen bg-slate-100">

      {/* HEADER */}
      <section className="bg-gradient-to-r from-emerald-700 to-green-600 text-white">
        <div className="mx-auto w-full max-w-[1500px] px-6 py-8 lg:px-8">

          <p className="text-sm text-emerald-100">
            LEAP Assessment AI
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            My Results
          </h1>

          <p className="mt-2 text-emerald-100">
            View your completed assessments and performance.
          </p>

        </div>
      </section>

      {/* CONTENT */}
      <div className="mx-auto w-full max-w-[1500px] px-6 py-8 lg:px-8">

        {/* BACK TO DASHBOARD */}
        <div className="mb-6">
          <Link
            href="/student/dashboard"
            className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* NO RESULTS */}
        {completedAttempts.length === 0 ? (

          <div className="rounded-xl border bg-white p-10 text-center shadow-sm">

            <h2 className="text-xl font-bold text-slate-900">
              No Results Yet
            </h2>

            <p className="mt-2 text-slate-500">
              Your completed assessments will appear here.
            </p>

            <Link
              href="/student/dashboard"
              className="mt-5 inline-flex rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              View Available Tests
            </Link>

          </div>

        ) : (

          /* RESULTS TABLE */
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
                      Correct
                    </th>

                    <th className="px-5 py-4 text-left">
                      Wrong
                    </th>

                    <th className="px-5 py-4 text-left">
                      Skipped
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
                        key={attempt.id}
                        className="border-t hover:bg-slate-50"
                      >

                        {/* TEST */}
                        <td className="px-5 py-4 font-semibold text-slate-900">

                          {attempt.tests?.title ||
                            `Test #${attempt.test_id}`}

                        </td>

                        {/* SUBJECT */}
                        <td className="px-5 py-4 text-slate-600">

                          {attempt.tests?.subjects?.name ??
                            "-"}

                        </td>

                        {/* SCORE */}
                        <td className="px-5 py-4 font-semibold text-slate-900">

                          {attempt.percentage ?? 0}%

                        </td>

                        {/* ACCURACY */}
                        <td className="px-5 py-4">

                          {attempt.accuracy ?? 0}%

                        </td>

                        {/* CORRECT */}
                        <td className="px-5 py-4 font-semibold text-emerald-600">

                          {attempt.correct ?? 0}

                        </td>

                        {/* WRONG */}
                        <td className="px-5 py-4 font-semibold text-red-600">

                          {attempt.wrong ?? 0}

                        </td>

                        {/* SKIPPED */}
                        <td className="px-5 py-4 font-semibold text-amber-600">

                          {attempt.skipped ?? 0}

                        </td>

                        {/* RESULT */}
                        <td className="px-5 py-4">

                          <Link
                            href={`/online-test/${attempt.test_id}/result/${attempt.id}`}
                            className="inline-flex rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
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

      </div>

    </main>
  );
}