// ============================================================================
// LEAP ASSESSMENT AI
// File: app/teacher/repository/page.tsx
// ============================================================================

"use client";

import Link from "next/link";
import {
  BookOpen,
  Layers,
  FolderGit2,
  FileText,
  ChevronRight,
} from "lucide-react";

const modules = [
  {
    title: "Subjects",
    description: "Manage all academic subjects.",
    icon: BookOpen,
    href: "/teacher/repository/subjects",
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Chapters",
    description: "Create and organize chapters.",
    icon: Layers,
    href: "/teacher/repository/chapters",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    title: "Topics",
    description: "Manage chapter-wise topics.",
    icon: FolderGit2,
    href: "/teacher/repository/topics",
    color: "bg-purple-50 text-purple-600",
  },
  {
    title: "Questions",
    description: "Maintain the central question bank.",
    icon: FileText,
    href: "/teacher/repository/questions",
    color: "bg-emerald-50 text-emerald-600",
  },
];

export default function RepositoryPage() {
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">

      {/* Header */}
      <div>
        <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
          Repository
        </p>

        <h1 className="text-3xl font-black text-slate-900 mt-2">
          Academic Repository
        </h1>

        <p className="mt-2 text-slate-600">
          Manage Subjects, Chapters, Topics and Questions from one central repository.
        </p>
      </div>

      {/* Cards */}

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

        {modules.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="group bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-lg transition"
          >

            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.color}`}
            >
              <item.icon className="w-7 h-7" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              {item.title}
            </h2>

            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              {item.description}
            </p>

            <div className="mt-6 flex items-center text-blue-600 font-semibold text-sm">
              Open Module
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition" />
            </div>

          </Link>
        ))}

      </div>

    </div>
  );
}