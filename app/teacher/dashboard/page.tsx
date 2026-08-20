"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

import {
  BookOpen,
  FileText,
  Users,
  BarChart3,
  BrainCircuit,
  Settings,
  LogOut,
  ArrowRight,
  LayoutDashboard,
  ClipboardList,
} from "lucide-react";

export default function TeacherDashboard() {
  const router = useRouter();

  const [teacherEmail, setTeacherEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  /* =========================================================
     CHECK TEACHER SESSION
  ========================================================= */

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/teacher/login");
        return;
      }

      setTeacherEmail(session.user.email || "");
      setLoading(false);
    }

    checkSession();
  }, [router]);

  /* =========================================================
     LOGOUT
  ========================================================= */

  const logout = async () => {
    try {
      setLoggingOut(true);

      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Teacher logout error:", error);
        setLoggingOut(false);
        return;
      }

      router.replace("/teacher/login");
      router.refresh();
    } catch (error) {
      console.error("Unexpected logout error:", error);
      setLoggingOut(false);
    }
  };

  /* =========================================================
     TEACHER DASHBOARD CARDS
  ========================================================= */

  const cards = [
    {
      title: "Create Test",
      description:
        "Create assessments using AI, Textbook, PDF, Video or Repository.",
      icon: BrainCircuit,
      href: "/teacher/assessment",
      color: "bg-indigo-600",
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },

    {
      title: "Publish Tests",
      description:
        "Review, edit, schedule and publish completed assessments.",
      icon: FileText,
      href: "/repository",
      color: "bg-emerald-600",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },

    {
      title: "Repository",
      description:
        "Manage subjects, chapters, topics and your question repository.",
      icon: BookOpen,
      href: "/teacher/repository",
      color: "bg-blue-600",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },

    {
      title: "Students",
      description:
        "Assign tests and monitor student participation and progress.",
      icon: Users,
      href: "/teacher/students",
      color: "bg-purple-600",
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },

    {
      title: "Analytics",
      description:
        "View performance reports, Bloom analysis and AI-powered insights.",
      icon: BarChart3,
      href: "/teacher/analytics",
      color: "bg-orange-500",
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },

    {
      title: "Settings",
      description:
        "Manage your profile, preferences and account settings.",
      icon: Settings,
      href: "/teacher/settings",
      color: "bg-slate-700",
      iconBg: "bg-slate-100",
      iconColor: "text-slate-700",
    },
  ];

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />

          <p className="text-sm font-medium text-slate-600">
            Loading Teacher Dashboard...
          </p>
        </div>
      </main>
    );
  }

  /* =========================================================
     DASHBOARD
  ========================================================= */

  return (
    <main className="min-h-screen bg-slate-50">

      {/* =====================================================
          TOP NAVIGATION
      ===================================================== */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 lg:px-8">

          {/* BRAND */}

          <Link
            href="/teacher/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-900">
                LEAP Assessment AI
              </h1>

              <p className="text-xs font-medium text-slate-500">
                Teacher Portal
              </p>
            </div>
          </Link>

          {/* NAVIGATION */}

          <nav className="hidden items-center gap-7 md:flex">

            <Link
              href="/teacher/dashboard"
              className="text-sm font-semibold text-blue-600"
            >
              Dashboard
            </Link>

            <Link
              href="/teacher/assessment"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              Create Test
            </Link>

            <Link
              href="/teacher/repository"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              Repository
            </Link>

            <Link
              href="/teacher/students"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              Students
            </Link>

          </nav>

          {/* LOGOUT */}

          <button
            type="button"
            onClick={logout}
            disabled={loggingOut}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut className="h-4 w-4" />

            {loggingOut ? "Signing out..." : "Logout"}
          </button>

        </div>
      </header>

      {/* =====================================================
          HERO / WELCOME
      ===================================================== */}

      <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 text-white">

        <div className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-8">

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

            <div>

              <p className="text-sm font-medium text-blue-100">
                LEAP Assessment AI
              </p>

              <h2 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
                Teacher Dashboard
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
                Create AI-powered assessments, manage your question
                repository, monitor students and analyse learning outcomes.
              </p>

              {teacherEmail && (
                <div className="mt-4 inline-flex items-center rounded-lg bg-white/10 px-3 py-2 text-sm text-blue-50 backdrop-blur-sm">
                  {teacherEmail}
                </div>
              )}

            </div>

            {/* QUICK ACTION */}

            <Link
              href="/teacher/assessment"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
            >
              <BrainCircuit className="h-5 w-5" />
              Create New Test
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>

        </div>

      </section>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">

        {/* ===================================================
            SECTION HEADER
        =================================================== */}

        <div className="mb-6">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
              <ClipboardList className="h-5 w-5 text-blue-600" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-slate-900">
                Teaching Tools
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Everything you need to create and manage assessments.
              </p>
            </div>

          </div>

        </div>

        {/* ===================================================
            DASHBOARD CARDS
        =================================================== */}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                key={card.title}
                href={card.href}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
              >

                {/* TOP ACCENT */}

                <div
                  className={`absolute left-0 top-0 h-1 w-full ${card.color}`}
                />

                {/* ICON */}

                <div
                  className={`mb-5 flex h-14 w-14 items-center justify-center rounded-xl ${card.iconBg} transition duration-200 group-hover:scale-105`}
                >
                  <Icon
                    className={`h-7 w-7 ${card.iconColor}`}
                  />
                </div>

                {/* TITLE */}

                <h4 className="text-xl font-bold text-slate-900">
                  {card.title}
                </h4>

                {/* DESCRIPTION */}

                <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-500">
                  {card.description}
                </p>

                {/* OPEN */}

                <div className="mt-6 flex items-center gap-2 text-sm font-bold text-blue-600">
                  Open
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </div>

              </Link>
            );
          })}

        </div>

        {/* ===================================================
            QUICK WORKFLOW
        =================================================== */}

        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-5">

            <h3 className="text-xl font-bold text-slate-900">
              Assessment Workflow
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              A simple workflow for creating and delivering assessments.
            </p>

          </div>

          <div className="grid gap-4 md:grid-cols-4">

            <Link
              href="/teacher/assessment"
              className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-300 hover:bg-blue-50"
            >
              <div className="text-sm font-bold text-blue-600">
                01
              </div>

              <div className="mt-2 font-semibold text-slate-900">
                Create
              </div>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Build an assessment using AI or your repository.
              </p>
            </Link>

            <Link
              href="/repository"
              className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-emerald-300 hover:bg-emerald-50"
            >
              <div className="text-sm font-bold text-emerald-600">
                02
              </div>

              <div className="mt-2 font-semibold text-slate-900">
                Review
              </div>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Review questions and prepare the assessment.
              </p>
            </Link>

            <Link
              href="/teacher/students"
              className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-purple-300 hover:bg-purple-50"
            >
              <div className="text-sm font-bold text-purple-600">
                03
              </div>

              <div className="mt-2 font-semibold text-slate-900">
                Assign
              </div>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Assign assessments to students and monitor participation.
              </p>
            </Link>

            <Link
              href="/teacher/analytics"
              className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-orange-300 hover:bg-orange-50"
            >
              <div className="text-sm font-bold text-orange-600">
                04
              </div>

              <div className="mt-2 font-semibold text-slate-900">
                Analyse
              </div>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Understand performance and learning outcomes.
              </p>
            </Link>

          </div>

        </section>

      </div>

    </main>
  );
}

