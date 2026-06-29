import type { QuestionBank } from "@/types/question-bank";

interface Props {
  questions: QuestionBank[];
}

export default function QuestionStats({
  questions,
}: Props) {
  const total = questions.length;

  const approved = questions.filter(
    (q) => q.status === "Approved"
  ).length;

  const drafts = questions.filter(
    (q) => q.status === "Draft"
  ).length;

  const aiGenerated = questions.filter(
    (q) => q.generated_by !== "Teacher"
  ).length;

  return (
    <div className="grid gap-5 md:grid-cols-4">

      <Card
        title="Total"
        value={total}
      />

      <Card
        title="Approved"
        value={approved}
      />

      <Card
        title="Draft"
        value={drafts}
      />

      <Card
        title="AI Generated"
        value={aiGenerated}
      />

    </div>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-lg border bg-white p-5">

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <h2 className="mt-2 text-3xl font-bold">
        {value}
      </h2>

    </div>
  );
}