// ============================================================================
// LEAP ASSESSMENT AI
// File: app/teacher/repository/chapters/page.tsx
// ============================================================================

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Layers,
  Plus,
  Search,
  ChevronRight,
  MoreVertical,
  FolderGit2,
} from "lucide-react";

interface Chapter {
  id: string;
  subjectId: string;
  subjectName: string;
  name: string;
  topicsCount: number;
  questionsCount: number;
}

const initialChapters: Chapter[] = [
  {
    id: "1",
    subjectId: "1",
    subjectName: "Mathematics",
    name: "Algebra",
    topicsCount: 12,
    questionsCount: 340,
  },
  {
    id: "2",
    subjectId: "1",
    subjectName: "Mathematics",
    name: "Calculus",
    topicsCount: 10,
    questionsCount: 285,
  },
  {
    id: "3",
    subjectId: "2",
    subjectName: "Physics",
    name: "Mechanics",
    topicsCount: 14,
    questionsCount: 390,
  },
  {
    id: "4",
    subjectId: "3",
    subjectName: "Chemistry",
    name: "Organic Chemistry",
    topicsCount: 11,
    questionsCount: 260,
  },
];

export default function ChaptersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [chapters] = useState<Chapter[]>(initialChapters);

  const filteredChapters = chapters.filter(
    (chapter) =>
      chapter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chapter.subjectName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/teacher/repository" className="hover:text-blue-600">
          Repository
        </Link>

        <ChevronRight className="w-4 h-4" />

        <Link
          href="/teacher/repository/subjects"
          className="hover:text-blue-600"
        >
          Subjects
        </Link>

        <ChevronRight className="w-4 h-4" />

        <span className="font-semibold text-slate-900">
          Chapters
        </span>
      </div>

      {/* Header */}

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

        <div>
          <h1 className="text-3xl font-black text-slate-900">
            Chapters Management
          </h1>

          <p className="mt-2 text-slate-600">
            Organize chapters under each academic subject.
          </p>
        </div>

        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-semibold">
          <Plus className="w-5 h-5" />
          Add New Chapter
        </button>

      </div>

      {/* Search */}

      <div className="bg-white border border-slate-200 rounded-2xl p-4">

        <div className="relative">

          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

          <input
            type="text"
            placeholder="Search chapter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
          />

        </div>

      </div>

      {/* Cards */}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

        {filteredChapters.map((chapter) => (

          <div
            key={chapter.id}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition"
          >

            <div className="flex justify-between">

              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>

              <span className="px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold">
                {chapter.subjectName}
              </span>

            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              {chapter.name}
            </h2>

            <div className="grid grid-cols-2 gap-4 mt-5 border-t pt-5">

              <div>
                <p className="text-xs text-slate-400">
                  Topics
                </p>

                <p className="font-bold text-lg">
                  {chapter.topicsCount}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Questions
                </p>

                <p className="font-bold text-lg">
                  {chapter.questionsCount}
                </p>
              </div>

            </div>

            <div className="mt-6 pt-4 border-t flex justify-between items-center">

              <Link
                href={`/teacher/repository/topics?chapterId=${chapter.id}`}
                className="text-blue-600 font-semibold text-sm flex items-center gap-1"
              >
                View Topics
                <ChevronRight className="w-4 h-4" />
              </Link>

              <button className="p-2 rounded-lg hover:bg-slate-100">
                <MoreVertical className="w-5 h-5 text-slate-500" />
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}