// ============================================================================
// LEAP ASSESSMENT AI
// File: app/teacher/repository/topics/page.tsx
// ============================================================================

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FolderGit2,
  Plus,
  Search,
  ChevronRight,
  MoreVertical,
  FileText,
} from "lucide-react";

interface Topic {
  id: string;
  chapterId: string;
  chapterName: string;
  subjectName: string;
  name: string;
  questionsCount: number;
}

const initialTopics: Topic[] = [
  {
    id: "1",
    chapterId: "1",
    chapterName: "Algebra",
    subjectName: "Mathematics",
    name: "Quadratic Equations",
    questionsCount: 85,
  },
  {
    id: "2",
    chapterId: "1",
    chapterName: "Algebra",
    subjectName: "Mathematics",
    name: "Matrices",
    questionsCount: 64,
  },
  {
    id: "3",
    chapterId: "3",
    chapterName: "Mechanics",
    subjectName: "Physics",
    name: "Newton's Laws",
    questionsCount: 92,
  },
  {
    id: "4",
    chapterId: "4",
    chapterName: "Organic Chemistry",
    subjectName: "Chemistry",
    name: "Hydrocarbons",
    questionsCount: 73,
  },
];

export default function TopicsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [topics] = useState<Topic[]>(initialTopics);

  const filteredTopics = topics.filter(
    (topic) =>
      topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.chapterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.subjectName.toLowerCase().includes(searchQuery.toLowerCase())
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

        <Link
          href="/teacher/repository/chapters"
          className="hover:text-blue-600"
        >
          Chapters
        </Link>

        <ChevronRight className="w-4 h-4" />

        <span className="font-semibold text-slate-900">
          Topics
        </span>

      </div>

      {/* Header */}

      <div className="flex flex-col md:flex-row justify-between gap-4">

        <div>
          <h1 className="text-3xl font-black text-slate-900">
            Topics Management
          </h1>

          <p className="text-slate-600 mt-2">
            Organize topics within each chapter.
          </p>
        </div>

        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-semibold">
          <Plus className="w-5 h-5" />
          Add New Topic
        </button>

      </div>

      {/* Search */}

      <div className="bg-white border rounded-2xl p-4">

        <div className="relative">

          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

          <input
            type="text"
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

      </div>

      {/* Topic Cards */}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

        {filteredTopics.map((topic) => (

          <div
            key={topic.id}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition"
          >

            <div className="flex justify-between">

              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <FolderGit2 className="w-6 h-6" />
              </div>

              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100">
                {topic.chapterName}
              </span>

            </div>

            <h2 className="mt-5 text-xl font-bold">
              {topic.name}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {topic.subjectName}
            </p>

            <div className="mt-5 border-t pt-5">

              <p className="text-xs text-slate-400">
                Questions
              </p>

              <p className="text-2xl font-bold">
                {topic.questionsCount}
              </p>

            </div>

            <div className="mt-6 pt-4 border-t flex justify-between items-center">

              <Link
                href={`/teacher/repository/questions?topicId=${topic.id}`}
                className="text-blue-600 text-sm font-semibold flex items-center gap-1"
              >
                View Questions
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