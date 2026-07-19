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

  attempt.tests.test_questions.forEach((q: any) => {

    const chapter =
      q.questions?.chapters?.name ??
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

    const answer = q.student_answer;

    if (!answer) {
      item.skipped++;
    } else if (
      answer.selected_answer ===
      q.questions.correct_answer
    ) {
      item.correct++;
    } else {
      item.wrong++;
    }

  });

  return (
    <div className="mt-8 rounded-2xl border bg-white p-8 shadow">

      <h2 className="mb-6 text-2xl font-bold">
        Chapter-wise Analysis
      </h2>

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

            {Array.from(analysis.entries()).map(
              ([chapter, stats]) => (

                <tr
                  key={chapter}
                  className="border-b hover:bg-slate-50"
                >

                  <td className="p-3">
                    {chapter}
                  </td>

                  <td className="p-3 text-center">
                    {stats.total}
                  </td>

                  <td className="p-3 text-center text-green-600 font-semibold">
                    {stats.correct}
                  </td>

                  <td className="p-3 text-center text-red-600 font-semibold">
                    {stats.wrong}
                  </td>

                  <td className="p-3 text-center text-yellow-600 font-semibold">
                    {stats.skipped}
                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}