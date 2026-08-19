"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  Loader2,
  Plus,
  Search,
  Sparkles,
  Target,
  X,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

interface Test {
  id: number;
  title: string;
  exam: string;
  class_name: string | null;
  subject_id: number | null;
  chapter_id: number | null;
  topic_id: number | null;
  duration_minutes: number;
  total_marks: number;
  total_questions: number;
  status: string | null;
}

interface Subject {
  id: number;
  name: string;
}

interface Chapter {
  id: number;
  name: string;
}

interface Topic {
  id: number;
  name: string;
}

interface Question {
  id: number;
  question_text: string;
  question_type: string | null;
  difficulty: string | null;
  marks: number | null;
  negative_marks: number | null;
  option_a: string | null;
  option_b: string | null;
  option_c: string | null;
  option_d: string | null;
}

export default function TestQuestionBuilderPage() {
  const router = useRouter();
  const params = useParams();
  const testId = Number(params.testId);

  const [loading, setLoading] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [saving, setSaving] = useState(false);

  const [test, setTest] = useState<Test | null>(null);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [existingQuestionIds, setExistingQuestionIds] = useState<number[]>([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([]);

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadTestData() {
      try {
        setLoading(true);
        setError("");

        if (!testId || Number.isNaN(testId)) {
          setError("Invalid test ID.");
          return;
        }

        const { data: testData, error: testError } = await supabase
          .from("tests")
          .select("*")
          .eq("id", testId)
          .single();

        if (testError || !testData) {
          setError(testError?.message || "Test not found.");
          return;
        }

        setTest(testData);

        const { data: existingData } = await supabase
          .from("test_questions")
          .select("question_id")
          .eq("test_id", testId);

        if (existingData) {
          setExistingQuestionIds(existingData.map((item) => item.question_id));
        }

        if (testData.subject_id) {
          supabase.from("subjects").select("id, name").eq("id", testData.subject_id).single().then(({ data }) => data && setSubject(data));
        }
        if (testData.chapter_id) {
          supabase.from("chapters").select("id, name").eq("id", testData.chapter_id).single().then(({ data }) => data && setChapter(data));
        }
        if (testData.topic_id) {
          supabase.from("topics").select("id, name").eq("id", testData.topic_id).single().then(({ data }) => data && setTopic(data));
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("Unable to load the test.");
      } finally {
        setLoading(false);
      }
    }

    loadTestData();
  }, [testId]);

  useEffect(() => {
    async function loadQuestions() {
      if (!test?.subject_id || !test?.chapter_id || !test?.topic_id) return;

      try {
        setLoadingQuestions(true);
        let query = supabase
          .from("questions")
          .select("*")
          .eq("subject_id", test.subject_id)
          .eq("chapter_id", test.chapter_id)
          .eq("topic_id", test.topic_id)
          .eq("is_active", true)
          .order("id", { ascending: false });

        if (difficulty !== "All") {
          query = query.eq("difficulty", difficulty);
        }

        const { data, error } = await query;
        if (error) throw error;
        setQuestions(data || []);
      } catch (err: any) {
        setError(err.message || "Unable to load questions.");
      } finally {
        setLoadingQuestions(false);
      }
    }

    loadQuestions();
  }, [test, difficulty]);

  const filteredQuestions = useMemo(() => {
    const text = search.trim().toLowerCase();
    if (!text) return questions;
    return questions.filter((q) => q.question_text.toLowerCase().includes(text));
  }, [questions, search]);

  function toggleQuestion(questionId: number) {
    if (existingQuestionIds.includes(questionId)) return;

    setSelectedQuestionIds((prev) => {
      if (prev.includes(questionId)) {
        return prev.filter((id) => id !== questionId);
      }
      const totalAllowed = test?.total_questions || 0;
      if (existingQuestionIds.length + prev.length >= totalAllowed) {
        setError(`You can select only ${totalAllowed} questions total for this test.`);
        return prev;
      }
      setError("");
      return [...prev, questionId];
    });
    setSuccess("");
  }

  async function addSelectedQuestions() {
    if (!test) return;
    setError("");
    setSuccess("");

    if (selectedQuestionIds.length === 0) {
      setError("Please select at least one question.");
      return;
    }

    try {
      setSaving(true);
      const { data: selectedQuestions, error: selErr } = await supabase
        .from("questions")
        .select("id, marks, negative_marks")
        .in("id", selectedQuestionIds);

      if (selErr) throw selErr;

      const currentCount = existingQuestionIds.length;
      const rows = (selectedQuestions || []).map((q, idx) => ({
        test_id: test.id,
        question_id: q.id,
        question_order: currentCount + idx + 1,
        marks: q.marks ?? 0,
        negative_marks: q.negative_marks ?? 0,
      }));

      const { error: insertError } = await supabase.from("test_questions").insert(rows);
      if (insertError) throw insertError;

      setSuccess(`${rows.length} question(s) added successfully!`);
      setExistingQuestionIds((prev) => [...prev, ...selectedQuestionIds]);
      setSelectedQuestionIds([]);
    } catch (err: any) {
      setError(err?.message || "Unable to add questions.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </main>
    );
  }

  if (!test) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-xl font-bold text-slate-900">Test Not Found</h1>
          <Link href="/repository" className="mt-4 inline-block text-blue-600 underline">Back to Repository</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/repository" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600">
              <ArrowLeft className="h-4 w-4" />
              Repository
            </Link>
            <div className="h-6 w-px bg-slate-200" />
            <h1 className="text-lg font-bold text-slate-900">Step 1: Select Questions</h1>
          </div>

          <Link
            href={`/repository/test/${testId}/review`}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800"
          >
            Review & Finalize
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* CONTENT */}
      <div className="mx-auto max-w-7xl px-8 py-8">
        {/* TEST INFO SUMMARY */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">{test.exam}</span>
            <h2 className="text-2xl font-bold text-slate-900">{test.title}</h2>
            <p className="text-xs text-slate-500 mt-1">Class {test.class_name}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase text-slate-400">Added / Target</p>
              <p className="text-lg font-bold text-slate-900">{existingQuestionIds.length} / {test.total_questions}</p>
            </div>
            <Link
              href={`/repository/test/${testId}/review`}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              Proceed to Review
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* QUESTION BANK CONTAINER */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search question text..."
                className="w-full rounded-xl border border-slate-300 px-10 py-3 text-sm outline-none focus:border-blue-500"
              />
            </div>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {error && <div className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</div>}
          {success && <div className="mb-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-600">{success}</div>}

          {loadingQuestions ? (
            <div className="py-16 text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" /></div>
          ) : filteredQuestions.length === 0 ? (
            <div className="py-16 text-center text-slate-500">No questions found matching criteria.</div>
          ) : (
            <div className="space-y-3">
              {filteredQuestions.map((q, idx) => {
                const isAlreadyAdded = existingQuestionIds.includes(q.id);
                const selected = selectedQuestionIds.includes(q.id);

                return (
                  <div
                    key={q.id}
                    onClick={() => !isAlreadyAdded && toggleQuestion(q.id)}
                    className={`rounded-xl border p-4 transition cursor-pointer ${
                      isAlreadyAdded
                        ? "border-emerald-200 bg-emerald-50/40 opacity-75 cursor-default"
                        : selected
                        ? "border-blue-600 bg-blue-50/60 ring-1 ring-blue-600"
                        : "border-slate-200 bg-white hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${isAlreadyAdded ? "bg-emerald-500 border-emerald-500 text-white" : selected ? "bg-blue-600 border-blue-600 text-white" : "border-slate-300"}`}>
                        {(isAlreadyAdded || selected) && <CheckCircle2 className="h-3.5 w-3.5" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-slate-400">Q{idx + 1}</span>
                          {isAlreadyAdded && <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">Added</span>}
                          {q.difficulty && <span className="rounded bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">{q.difficulty}</span>}
                          {q.marks !== null && <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">{q.marks} marks</span>}
                        </div>
                        <p className="text-sm font-medium text-slate-800">{q.question_text}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
            <span className="text-sm font-bold text-slate-800">{selectedQuestionIds.length} selected to add</span>
            <button
              type="button"
              onClick={addSelectedQuestions}
              disabled={saving || selectedQuestionIds.length === 0}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Add Selected Questions
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}