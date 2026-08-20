"use client";

import { useRouter } from "next/navigation";
import {
  BookOpen,
  Stethoscope,
  GraduationCap,
  ArrowRight,
} from "lucide-react";

const examinations = [
  {
    id: "cbse",
    title: "CBSE",
    subtitle: "School & Board Assessment",
    description:
      "Create class-based assessments, competency-based questions, case studies, and board-oriented tests.",
    icon: BookOpen,
    href: "/teacher/assessment/create",
    iconClass: "bg-blue-100 text-blue-700",
    borderClass: "hover:border-blue-400",
    buttonClass: "bg-blue-600 hover:bg-blue-700",
  },
  {
    id: "neet",
    title: "NEET",
    subtitle: "Medical Entrance",
    description:
      "Create NEET-oriented assessments for Physics, Chemistry, and Biology with entrance-exam focused requirements.",
    icon: Stethoscope,
    href: "/teacher/assessment/neet",
    iconClass: "bg-emerald-100 text-emerald-700",
    borderClass: "hover:border-emerald-400",
    buttonClass: "bg-emerald-600 hover:bg-emerald-700",
  },
  {
    id: "jee",
    title: "JEE",
    subtitle: "Engineering Entrance",
    description:
      "Create JEE-oriented assessments for Physics, Chemistry, and Mathematics.",
    icon: GraduationCap,
    href: "/teacher/assessment/jee",
    iconClass: "bg-indigo-100 text-indigo-700",
    borderClass: "hover:border-indigo-400",
    buttonClass: "bg-indigo-600 hover:bg-indigo-700",
  },
];

export default function AssessmentSelectionPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700">
            LEAP Assessment AI
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Create Assessment
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600">
            Select the examination framework for which you want to create
            an assessment.
          </p>
        </div>

        {/* Examination Cards */}
        <div className="grid gap-6 md:grid-cols-3">

          {examinations.map((exam) => {
            const Icon = exam.icon;

            return (
              <div
                key={exam.id}
                className={`group flex flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${exam.borderClass}`}
              >

                {/* Icon */}
                <div
                  className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${exam.iconClass}`}
                >
                  <Icon className="h-7 w-7" />
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-slate-900">
                  {exam.title}
                </h2>

                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {exam.subtitle}
                </p>

                {/* Description */}
                <p className="mt-4 flex-1 text-sm leading-6 text-slate-600">
                  {exam.description}
                </p>

                {/* Button */}
                <button
                  type="button"
                  onClick={() => router.push(exam.href)}
                  className={`mt-7 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition ${exam.buttonClass}`}
                >
                  Continue
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>

              </div>
            );
          })}

        </div>

        {/* Footer note */}
        <div className="mt-10 text-center">
          <p className="text-xs text-slate-400">
            Choose the examination framework first. LEAP will then present
            the appropriate assessment requirements.
          </p>
        </div>

      </div>
    </main>
  );
}
