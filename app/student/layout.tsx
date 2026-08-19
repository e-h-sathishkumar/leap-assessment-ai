"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { logout } from "@/services/auth/auth.service";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.replace("/student/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-slate-100">

      {/* STUDENT NAVIGATION */}
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between px-6 py-4 lg:px-8">

          {/* BRAND */}
          <Link
            href="/student/dashboard"
            className="text-xl font-bold text-emerald-700"
          >
            LEAP Assessment AI
          </Link>

          {/* NAVIGATION */}
          <nav className="flex items-center gap-2">

            <Link
              href="/student/dashboard"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
            >
              Dashboard
            </Link>

            <Link
              href="/online-test"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
            >
              Available Tests
            </Link>

            <Link
              href="/student/results"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
            >
              My Results
            </Link>

            {/* LOGOUT */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>

          </nav>

        </div>
      </header>

      {/* PAGE CONTENT */}
      {children}

    </div>
  );
}