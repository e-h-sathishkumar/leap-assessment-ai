"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle,
  FileText,
  Loader2,
  Trash2,
  Send,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

interface Test {
  id: number;
  title: string;
  exam: string;
  class_name: string | null;
  total_marks: number;
  total_questions: number;
  duration_minutes: number;
  status: string | null;
}

interface TestQuestionItem {
  id: number;
  question_order: number;
  marks: number;
  negative_marks: number;
  question: {
    id: number;
    question_text: string;
    question_type: string | null;
    difficulty: string | null;
    option_a: string | null;
    option_b: string | null;
    option_c: string | null;
    option_d: string | null;
  };
}

export default function TestReviewPage() {
  const router = useRouter();
  const params = useParams();
  const testId = Number(params.testId);

  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [test, setTest] = useState<Test | null>(null);
  const [items, setItems] = useState<TestQuestionItem[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadReviewData() {
      try {
        setLoading(true);
        if (!testId) return;

        const { data: testData, error: testErr } = await supabase
          .from("tests")
          .select("*")
          .eq("id", testId)
          .single();

        if (testErr || !testData) throw new Error("Test not found");
        setTest(testData);

        const { data: tqData, error: tqErr } = await supabase
          .from("test_questions")
          .select(`
            id,
            question_order,
            marks,
            negative_marks,
            question:questions (
              id,
              question_text,
              question_type,
              difficulty,
              option_a,
              option_b,
              option_c,
              option_d
            )
          `)
          .eq("test_id", testId)
          .order("question_order", { ascending: true });

        if (tqErr) throw tqErr;
        setItems((tqData as unknown as TestQuestionItem[]) || []);
      } catch (err: any) {
        setError(err.message || "Failed to load review details.");
      } finally {
        setLoading(false);
      }
    }

    loadReviewData();
  }, [testId]);

  async function handleRemoveQuestion(testQuestionId: number) {
    if (!confirm("Remove this question from the test?")) return;

    try {
      const { error } = await supabase
        .from("test_questions")
        .delete()
        .eq("id", testQuestionId);

      if (error) throw error;
      setItems((prev) => prev.filter((item) => item.id !== testQuestionId));
    } catch (err: any) {
      alert(err.message || "Failed to remove question.");
    }
  }

  async function handlePublishTest() {
    try {
      setPublishing(true);
      setError("");

      const { error } = await supabase
        .from("tests")
        .update({ status: "Published" })
        .eq("id", testId);

      if (error) throw error;

      setSuccess("Test successfully published!");
      setTimeout(() => {
        router.push("/repository");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to publish test.");
    } finally {
      setPublishing(false);
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
            <Link
              href={`/repository/test/${testId}`}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Question Selector
            </Link>
            <div className="h-6 w-px bg-slate-200" />
            <h1 className="text-lg font-bold text-slate-900">Step 2: Review & Finalize</h1>
          </div>

          <button
            type="button"
            onClick={handlePublishTest}
            disabled={publishing}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
          >
            {publishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Publish Test
          </button>
        </div>
      </header>

      {/* CONTENT */}
      <div className="mx-auto max-w-4xl px-8 py-8">
        {error && <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</div>}
        {success && <div className="mb-6 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-600">{success}</div>}

        {/* TEST OVERVIEW CARD */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">{test.exam}</span>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">{test.title}</h2>
          <p className="text-xs text-slate-500 mt-0.5">Class {test.class_name}</p>

          <div className="mt-6 grid grid-cols-3 gap-3 border-t border-slate-100 pt-5">
            <div className="rounded-xl bg-slate-50 p-3">
              <span className="block text-xs uppercase text-slate-400 font-semibold">Total Questions</span>
              <span className="text-lg font-bold text-slate-800">{items.length}</span>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <span className="block text-xs uppercase text-slate-400 font-semibold">Total Marks</span>
              <span className="text-lg font-bold text-slate-800">{test.total_marks}</span>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <span className="block text-xs uppercase text-slate-400 font-semibold">Duration</span>
              <span className="text-lg font-bold text-slate-800">{test.duration_minutes}m</span>
            </div>
          </div>
        </div>

        {/* QUESTIONS REVIEW LIST */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Added Questions ({items.length})</h3>

          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <FileText className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm text-slate-500">No questions added to this test yet.</p>
              <Link
                href={`/repository/test/${testId}`}
                className="mt-4 inline-block rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white"
              >
                Select Questions
              </Link>
            </div>
          ) : (
            items.map((item, idx) => (
              <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                      Q{idx + 1}
                    </span>
                    <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      {item.marks} marks
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(item.id)}
                    className="text-slate-400 hover:text-red-600 p-1"
                    title="Remove question"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <p className="mt-3 text-sm font-medium text-slate-800 leading-6">
                  {item.question?.question_text}
                </p>

                {item.question?.option_a && (
                  <div className="mt-4 grid gap-2 md:grid-cols-2">
                    {["A", "B", "C", "D"].map((letter) => {
                      const optVal =
                        letter === "A"
                          ? item.question.option_a
                          : letter === "B"
                          ? item.question.option_b
                          : letter === "C"
                          ? item.question.option_c
                          : item.question.option_d;
                      if (!optVal) return null;
                      return (
                        <div key={letter} className="rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2 text-xs text-slate-600">
                          <span className="mr-2 font-bold text-slate-400">{letter}.</span>
                          {optVal}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* BOTTOM FINAL ACTIONS */}
        <div className="mt-8 flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <Link
            href={`/repository/test/${testId}`}
            className="text-sm font-semibold text-slate-600 hover:text-slate-900"
          >
            ← Add more questions
          </Link>

          <button
            type="button"
            onClick={handlePublishTest}
            disabled={publishing || items.length === 0}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
          >
            {publishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
            Finalize & Publish Test
          </button>
        </div>
      </div>
    </main>
  );
}