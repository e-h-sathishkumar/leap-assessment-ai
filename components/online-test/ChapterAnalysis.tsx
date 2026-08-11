"use client";

interface Props {
  attempt: any;
}

export default function ChapterAnalysis({
  attempt,
}: Props) {
  const analysis = new Map<
    string,
    {
      total: number;
      correct: number;
      wrong: number;
      skipped: number;
    }
  >();

  const testQuestions =
    attempt?.tests?.test_questions ?? [];

  testQuestions.forEach((q: any) => {
    const question = q.questions;

    if (!question) {
      return;
    }

    const chapter =
      question.chapters?.name ??
      "Unknown Chapter";

    if (!analysis.has(chapter)) {
      analysis.set(chapter, {
        total: 0,
        correct: 0,
        wrong: 0,
        skipped: 0,
      });
    }

    const item = analysis.get(chapter)!;

    item.total++;

    /*
     * student_answers belongs to the question.
     * We need the answer belonging to this attempt.
     */
    const answers =
      question.student_answers ?? [];

    const answer = answers.find(
      (a: any) =>
        Number(a.attempt_id) ===
        Number(attempt.id)
    );

    if (!answer || !answer.selected_answer) {
      item.skipped++;
    } else if (answer.is_correct === true) {
      item.correct++;
    } else {
      item.wrong++;
    }
  });

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">
        Chapter-wise Analysis
      </h2>

      {analysis.size === 0 ? (
        <div className="rounded-xl border bg-slate-50 p-6 text-center text-slate-500">
          No chapter analysis available.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-slate-100">
                <th className="p-3 text-left">
                  Chapter
                </th>

                <th className="p-3 text-center">
                  Total
                </th>

                <th className="p-3 text-center">
                  Correct
                </th>

                <th className="p-3 text-center">
                  Wrong
                </th>

                <th className="p-3 text-center">
                  Skipped
                </th>
              </tr>
            </thead>

            <tbody>
              {Array.from(
                analysis.entries()
              ).map(
                ([chapter, stats]) => (
                  <tr
                    key={chapter}
                    className="border-b hover:bg-slate-50"
                  >
                    <td className="p-3 font-medium">
                      {chapter}
                    </td>

                    <td className="p-3 text-center">
                      {stats.total}
                    </td>

                    <td className="p-3 text-center font-semibold text-green-600">
                      {stats.correct}
                    </td>

                    <td className="p-3 text-center font-semibold text-red-600">
                      {stats.wrong}
                    </td>

                    <td className="p-3 text-center font-semibold text-yellow-600">
                      {stats.skipped}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}