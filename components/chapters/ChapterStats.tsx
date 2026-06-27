import { BookOpen, CheckCircle2 } from "lucide-react";

import StatsCard from "@/components/shared/StatsCard";
import type { Chapter } from "@/types/chapter";

interface ChapterStatsProps {
  chapters: Chapter[];
}

export default function ChapterStats({
  chapters,
}: ChapterStatsProps) {
  const totalChapters = chapters.length;

  const activeChapters = chapters.filter(
    (chapter) => chapter.is_active
  ).length;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatsCard
        title="Total Chapters"
        value={totalChapters}
        description="Available in repository"
        icon={<BookOpen className="h-7 w-7" />}
      />

      <StatsCard
        title="Active Chapters"
        value={activeChapters}
        description="Currently enabled"
        icon={<CheckCircle2 className="h-7 w-7" />}
      />
    </div>
  );
}