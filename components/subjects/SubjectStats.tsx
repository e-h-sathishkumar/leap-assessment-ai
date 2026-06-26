import { BookOpen, CheckCircle2 } from "lucide-react";

import StatsCard from "@/components/shared/StatsCard";
import type { Subject } from "@/types/subject";

interface SubjectStatsProps {
  subjects: Subject[];
}

export default function SubjectStats({
  subjects,
}: SubjectStatsProps) {
  const totalSubjects = subjects.length;

  const activeSubjects = subjects.filter(
    (subject) => subject.is_active
  ).length;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatsCard
        title="Total Subjects"
        value={totalSubjects}
        description="Available in repository"
        icon={<BookOpen className="h-7 w-7" />}
      />

      <StatsCard
        title="Active Subjects"
        value={activeSubjects}
        description="Currently enabled"
        icon={<CheckCircle2 className="h-7 w-7" />}
      />
    </div>
  );
}