// ====================================================
// Component : AssessmentDashboard
// Module    : Assessment
// Purpose   : Dashboard for managing assessments.
// ====================================================

import Link from "next/link";
import { ClipboardList, CheckCircle2, CalendarClock, BarChart3 } from "lucide-react";

import PageHeader from "@/components/shared/PageHeader";
import PageContainer from "@/components/shared/PageContainer";
import StatsGrid from "@/components/shared/StatsGrid";
import StatCard from "@/components/shared/StatCard";
import { Button } from "@/components/ui/button";

export default function AssessmentDashboard() {
  return (
    <PageContainer>
      <PageHeader
        title="Assessment Dashboard"
        description="Create, publish and monitor online assessments."
        action={
          <Link href="/assessment/create">
            <Button>Create Test</Button>
          </Link>
        }
      />

      <StatsGrid>
        <StatCard
          title="Draft Tests"
          value={0}
          subtitle="Saved as draft"
          icon={<ClipboardList size={22} />}
        />

        <StatCard
          title="Published"
          value={0}
          subtitle="Ready for students"
          icon={<CheckCircle2 size={22} />}
        />

        <StatCard
          title="Scheduled"
          value={0}
          subtitle="Upcoming tests"
          icon={<CalendarClock size={22} />}
        />

        <StatCard
          title="Results"
          value={0}
          subtitle="Completed assessments"
          icon={<BarChart3 size={22} />}
        />
      </StatsGrid>

      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
        <ClipboardList className="mx-auto mb-4 h-12 w-12 text-slate-400" />

        <h2 className="text-xl font-semibold text-slate-800">
          No Assessments Yet
        </h2>

        <p className="mt-2 text-slate-500">
          Create your first assessment to start conducting online tests.
        </p>

        <Link href="/assessment/create">
          <Button className="mt-6">
            Create Your First Test
          </Button>
        </Link>
      </div>
    </PageContainer>
  );
}