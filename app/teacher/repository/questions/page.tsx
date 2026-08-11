// ============================================================================
// LEAP ASSESSMENT AI
// File: app/teacher/repository/questions/page.tsx
// ============================================================================

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  Plus,
  ChevronRight,
  Sparkles,
  Eye,
  Pencil,
} from "lucide-react";

interface Question {
  id: string;
  subject: string;
  chapter: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  marks: number;
  question: string;
}

const initialQuestions: Question[] = [
  {
    id: "Q001",
    subject: "Mathematics",
    chapter: "Algebra",
    topic: "Quadratic Equations",
    difficulty: "Easy",
    marks: 1,
    question: "Find the roots of x² − 5x + 6 = 0.",
  },
  {
    id: "Q002",
    subject: "Physics",
    chapter: "Mechanics",
    topic: "Newton's Laws",
    difficulty: "Medium",
    marks: 2,
    question: "State Newton's Second Law of Motion.",
  },
  {
    id: "Q003",
    subject: "Chemistry",
    chapter: "Organic Chemistry",
    topic: "Hydrocarbons",
    difficulty: "Hard",
    marks: 5,
    question: "Explain the mechanism of electrophilic substitution in benzene.",
  },
];

export default function QuestionsPage() {
  const [search, setSearch] = useState("");
  const [questions] = useState<Question[]>(initialQuestions);

  const filtered = questions.filter(
    (q) =>
      q.question.toLowerCase().includes(search.toLowerCase()) ||
      q.subject.toLowerCase().includes(search.toLowerCase()) ||
      q.chapter.toLowerCase().includes(search.toLowerCase()) ||
      q.topic.toLowerCase().includes(search.toLowerCase())
  );

  const badgeColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-700";
      case "Medium":
        return "bg-amber-100 text-amber-700";
      case "Hard":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">

      {/* Breadcrumb */}

      <div className="flex items-center gap-2 text-sm text-slate-500">

        <Link href="/teacher/repository">Repository</Link>

        <ChevronRight className="w-4 h-4"/>

        <span className="font-semibold text-slate-900">
          Question Bank
        </span>

      </div>

      {/* Header */}

      <div className="flex flex-col md:flex-row justify-between gap-4">

        <div>

          <h1 className="text-3xl font-black text-slate-900">
            Question Bank
          </h1>

          <p className="text-slate-600 mt-2">
            Central repository of all questions available for AI and Assessments.
          </p>

        </div>

        <div className="flex gap-3">

          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-2xl font-semibold">
            <Sparkles className="w-5 h-5"/>
            AI Generate
          </button>

          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-semibold">
            <Plus className="w-5 h-5"/>
            Add Question
          </button>

        </div>

      </div>

      {/* Search */}

      <div className="bg-white border rounded-2xl p-4">

        <div className="relative">

          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"/>

          <input
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            placeholder="Search questions..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
          />

        </div>

      </div>

      {/* Table */}

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

        <table className="w-full">

          <thead className="bg-slate-50">

            <tr className="text-left text-sm">

              <th className="p-4">Question</th>
              <th className="p-4">Subject</th>
              <th className="p-4">Chapter</th>
              <th className="p-4">Topic</th>
              <th className="p-4">Difficulty</th>
              <th className="p-4">Marks</th>
              <th className="p-4 text-center">Actions</th>

            </tr>

          </thead>

          <tbody>

            {filtered.map((q)=>(
              <tr
                key={q.id}
                className="border-t hover:bg-slate-50"
              >

                <td className="p-4 font-medium">
                  {q.question}
                </td>

                <td className="p-4">
                  {q.subject}
                </td>

                <td className="p-4">
                  {q.chapter}
                </td>

                <td className="p-4">
                  {q.topic}
                </td>

                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeColor(q.difficulty)}`}>
                    {q.difficulty}
                  </span>
                </td>

                <td className="p-4">
                  {q.marks}
                </td>

                <td className="p-4">

                  <div className="flex justify-center gap-2">

                    <button className="p-2 rounded-lg hover:bg-slate-100">
                      <Eye className="w-4 h-4"/>
                    </button>

                    <button className="p-2 rounded-lg hover:bg-slate-100">
                      <Pencil className="w-4 h-4"/>
                    </button>

                  </div>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}