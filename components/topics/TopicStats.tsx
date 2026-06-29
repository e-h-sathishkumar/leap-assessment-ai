import type { Topic } from "@/types/topic";

interface TopicStatsProps {
  topics: Topic[];
}

export default function TopicStats({
  topics,
}: TopicStatsProps) {
  const total = topics.length;

  const active = topics.filter(
    (topic) => topic.is_active
  ).length;

  const inactive = total - active;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">
          Total Topics
        </p>

        <h2 className="mt-2 text-3xl font-bold">
          {total}
        </h2>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">
          Active Topics
        </p>

        <h2 className="mt-2 text-3xl font-bold text-green-600">
          {active}
        </h2>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">
          Inactive Topics
        </p>

        <h2 className="mt-2 text-3xl font-bold text-red-600">
          {inactive}
        </h2>
      </div>
    </div>
  );
}