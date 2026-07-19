import { notFound } from "next/navigation";
import ChapterAnalysis from "@/components/online-test/ChapterAnalysis";
import { getAttemptById } from "@/services/test.service";
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

  const attempt = await getAttemptById(attemptId);

  if (!attempt) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-8 py-6">

      {/* Header */}

      <ResultHeader
        attempt={attempt}
        testId={id}
        attemptId={attemptId}
      />

      {/* Summary */}

      <ResultSummary attempt={attempt} />
      <PerformanceDashboard attempt={attempt} />
      <ChapterAnalysis attempt={attempt} />

      {/* Question Navigation */}

      <div className="mt-8">
        <ResultNavigation
          questions={attempt.tests.test_questions}
          attemptId={Number(attemptId)}
        />
      </div>

      {/* Question Review */}

      <div className="mt-12">

        <h2 className="mb-6 text-3xl font-bold">
          Question Review
        </h2>

        {attempt.tests.test_questions.length === 0 ? (
          <div className="rounded-xl border bg-white p-8 text-center text-gray-500 shadow">
            No questions found.
          </div>
        ) : (
          <div className="space-y-8">
            {attempt.tests.test_questions.map(
              (testQuestion: any) => (
                <ResultQuestionCard
                  key={testQuestion.question_order}
                  testQuestion={testQuestion}
                  attemptId={Number(attemptId)}
                />
              )
            )}
          </div>
        )}

      </div>

    </div>
  );
}