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
} from "lucide-react";

export default function TeacherDashboard() {
  const router = useRouter();

  const [teacherEmail, setTeacherEmail] = useState("");
  const [loading, setLoading] = useState(true);

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

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/teacher/login");
  };

  /* =========================================================
     TEACHER DASHBOARD CARDS
  ========================================================= */

  const cards = [
    {
      title: "Create Test",
      description:
        "Create tests using AI, Textbook, PDF, Video or Repository",
      icon: BrainCircuit,
      href: "/teacher/assessment/create",
      color: "bg-indigo-600",
    },
    {
      title: "Publish Tests",
      description:
        "Review, edit, schedule and publish completed assessments",
      icon: FileText,
      href: "/repository",
      color: "bg-green-600",
    },
    {
      title: "Repository",
      description:
        "Manage subjects, chapters, topics and question repository",
      icon: BookOpen,
      href: "/teacher/repository",
      color: "bg-blue-600",
    },
    {
      title: "Students",
      description:
        "Assign tests and monitor student progress",
      icon: Users,
      href: "/teacher/students",
      color: "bg-purple-600",
    },
    {
      title: "Analytics",
      description:
        "Performance reports, Bloom analysis and AI insights",
      icon: BarChart3,
      href: "/teacher/analytics",
      color: "bg-orange-500",
    },
    {
      title: "Settings",
      description:
        "Profile, preferences and account settings",
      icon: Settings,
      href: "/teacher/settings",
      color: "bg-slate-700",
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
            Loading Dashboard...
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
          HEADER
      ===================================================== */}

      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">

          <div>
            <h1 className="text-3xl font-bold text-blue-700">
              LEAP Assessment AI
            </h1>

            <p className="text-slate-500">
              Teacher Dashboard
            </p>

            <p className="mt-1 text-sm font-medium text-blue-600">
              {teacherEmail}
            </p>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>
      </header>

      {/* =====================================================
          WELCOME
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-8 py-8">

        <h2 className="text-3xl font-bold text-slate-900">
          Welcome Teacher 👋
        </h2>

        <p className="mt-2 text-slate-600">
          Create AI-powered tests, publish assessments, manage
          your repository, monitor students and analyse learning
          outcomes.
        </p>

      </section>

      {/* =====================================================
          DASHBOARD CARDS
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-8 pb-12">

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                key={card.title}
                href={card.href}
                className="group rounded-2xl bg-white p-6 shadow-md transition duration-200 hover:-translate-y-1 hover:shadow-xl"
              >

                {/* Icon */}

                <div
                  className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${card.color} transition duration-200 group-hover:scale-105`}
                >
                  <Icon className="h-7 w-7 text-white" />
                </div>

                {/* Title */}

                <h3 className="text-xl font-semibold text-slate-900">
                  {card.title}
                </h3>

                {/* Description */}

                <p className="mt-2 text-slate-500">
                  {card.description}
                </p>

                {/* Navigation hint */}

                <div className="mt-5 text-sm font-semibold text-blue-600 opacity-0 transition group-hover:opacity-100">
                  Open →
                </div>

              </Link>
            );
          })}

        </div>

      </section>

    </main>
  );
}