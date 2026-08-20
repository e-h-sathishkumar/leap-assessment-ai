import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  GraduationCap,
  BrainCircuit,
} from "lucide-react";

const assessmentTypes = [
  {
    title: "CBSE",
    subtitle: "School Assessment",
    description:
      "Create CBSE assessments aligned with class, subject, chapter, topic, question type and difficulty.",
    icon: BookOpen,
    href: "/teacher/assessment/create",
    badge: "CBSE",
    iconClass: "bg-blue-50 text-blue-600",
    borderClass: "border-blue-200 hover:border-blue-400",
  },
  {
    title: "NEET",
    subtitle: "Medical Entrance",
    description:
      "Create NEET-focused practice tests and assessments with subject-wise and examination-oriented question generation.",
    icon: GraduationCap,
    href: "/teacher/assessment/neet",
    badge: "NEET",
    iconClass: "bg-emerald-50 text-emerald-600",
    borderClass: "border-emerald-200 hover:border-emerald-400",
  },
  {
    title: "JEE",
    subtitle: "Engineering Entrance",
    description:
      "Create JEE assessments with examination-focused question generation for Physics, Chemistry and Mathematics.",
    icon: BrainCircuit,
    href: "/teacher/assessment/jee",
    badge: "JEE",
    iconClass: "bg-violet-50 text-violet-600",
    borderClass: "border-violet-200 hover:border-violet-400",
  },
];

export default function AssessmentSelectionPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <Link
            href="/teacher/dashboard"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-8 text-white shadow-lg">
            <p className="mb-2 text-sm font-medium text-blue-100">
              LEAP Assessment AI
            </p>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Create New Assessment
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
              Choose the examination framework first. LEAP will then take you
              to the appropriate assessment workspace and show the requirements
              specific to that examination.
            </p>
          </div>
        </div>

        {/* Selection */}
        <section>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              Select Assessment Framework
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Choose one option to continue.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {assessmentTypes.map((assessment) => {
              const Icon = assessment.icon;

              return (
                <Link
                  key={assessment.title}
                  href={assessment.href}
                  className={`group rounded-2xl border bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg ${assessment.borderClass}`}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl ${assessment.iconClass}`}
                    >
                      <Icon className="h-7 w-7" />
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                      {assessment.badge}
                    </span>
                  </div>

                  <h3 className="mt-6 text-2xl font-bold text-slate-900">
                    {assessment.title}
                  </h3>

                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    {assessment.subtitle}
                  </p>

                  <p className="mt-4 min-h-[72px] text-sm leading-6 text-slate-600">
                    {assessment.description}
                  </p>

                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-600 transition group-hover:gap-3">
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Workflow */}
        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Assessment Workflow
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-4">
            {[
              ["01", "Choose Framework", "CBSE, NEET or JEE"],
              ["02", "Set Requirements", "Configure the assessment"],
              ["03", "Generate", "AI creates questions"],
              ["04", "Review & Save", "Approve and save the test"],
            ].map(([number, title, description]) => (
              <div
                key={number}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <p className="text-xs font-bold text-blue-600">{number}</p>

                <h3 className="mt-2 text-sm font-bold text-slate-900">
                  {title}
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
