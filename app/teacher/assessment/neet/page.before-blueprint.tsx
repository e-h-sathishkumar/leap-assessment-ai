"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  ChevronDown,
  GraduationCap,
} from "lucide-react";

type Subject =
  | "Physics"
  | "Chemistry"
  | "Botany"
  | "Zoology";

type AssessmentMode =
  | "Full NEET"
  | "Subject Test"
  | "Chapter Test"
  | "Topic Practice";

export default function NEETWorkspace() {
  const router = useRouter();

  const [mode, setMode] =
    useState<AssessmentMode>("Full NEET");

  const [subjects, setSubjects] = useState<Subject[]>([
    "Physics",
    "Chemistry",
    "Botany",
    "Zoology",
  ]);

  const [chapter, setChapter] = useState("");
  const [topic, setTopic] = useState("");

  const [questionCount, setQuestionCount] =
    useState(50);

  const [difficulty, setDifficulty] =
    useState("Mixed");

  const [questionType, setQuestionType] =
    useState("NEET MCQ");

  const [duration, setDuration] =
    useState(60);

  const [language, setLanguage] =
    useState("English");

  const [instructions, setInstructions] =
    useState("");

  function toggleSubject(subject: Subject) {
    setSubjects((current) =>
      current.includes(subject)
        ? current.filter((item) => item !== subject)
        : [...current, subject]
    );
  }

  function continueToGeneration() {
    const configuration = {
      exam: "NEET",
      framework: "NEET",
      className: "Class 11 / 12",
      assessmentMode: mode,
      subjects,
      chapter,
      topic,
      totalQuestions: questionCount,
      numberOfQuestions: questionCount,
      difficulty,
      questionType,
      durationMinutes: duration,
      duration,
      language,
      additionalInstructions: instructions,
    };

    sessionStorage.setItem(
      "leap_neet_assessment_configuration",
      JSON.stringify(configuration)
    );

    router.push(
      "/teacher/assessment/questions?framework=neet"
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-8">

        {/* BACK */}
        <button
          type="button"
          onClick={() => router.push("/teacher/assessment")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Assessment Selection
        </button>

        {/* HEADER */}
        <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 p-8 text-white shadow-lg">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                  <GraduationCap className="h-7 w-7" />
                </div>

                <span className="rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold">
                  NEET
                </span>
              </div>

              <h1 className="text-3xl font-bold sm:text-4xl">
                NEET Assessment Workspace
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50 sm:text-base">
                Configure your NEET assessment requirements before
                LEAP generates the questions.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5 text-sm backdrop-blur">
              <p className="font-semibold">
                NEET Question Generation
              </p>
              <p className="mt-1 text-emerald-100">
                Examination-focused AI assessment
              </p>
            </div>
          </div>
        </section>

        {/* PROGRESS */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-xs font-bold text-emerald-600">
              STEP 01
            </p>
            <p className="mt-1 text-sm font-bold text-slate-900">
              Requirements
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-bold text-slate-400">
              STEP 02
            </p>
            <p className="mt-1 text-sm font-bold text-slate-500">
              Generate
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-bold text-slate-400">
              STEP 03
            </p>
            <p className="mt-1 text-sm font-bold text-slate-500">
              Review & Save
            </p>
          </div>
        </div>

        {/* FORM */}
        <div className="mt-8 space-y-6">

          {/* MODE */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              1. Assessment Mode
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              What type of NEET assessment do you want to create?
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                "Full NEET",
                "Subject Test",
                "Chapter Test",
                "Topic Practice",
              ].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    setMode(item as AssessmentMode)
                  }
                  className={`rounded-xl border p-4 text-left transition ${
                    mode === item
                      ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100"
                      : "border-slate-200 bg-white hover:border-emerald-300"
                  }`}
                >
                  <p className="font-bold text-slate-900">
                    {item}
                  </p>

                  {mode === item && (
                    <CheckCircle2 className="mt-3 h-5 w-5 text-emerald-600" />
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* SUBJECTS */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              2. Subjects
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select the NEET subjects to include.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(
                [
                  "Physics",
                  "Chemistry",
                  "Botany",
                  "Zoology",
                ] as Subject[]
              ).map((subject) => {
                const selected =
                  subjects.includes(subject);

                return (
                  <button
                    key={subject}
                    type="button"
                    onClick={() =>
                      toggleSubject(subject)
                    }
                    className={`flex items-center justify-between rounded-xl border p-4 transition ${
                      selected
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 bg-white hover:border-blue-300"
                    }`}
                  >
                    <span className="font-semibold text-slate-900">
                      {subject}
                    </span>

                    {selected && (
                      <CheckCircle2 className="h-5 w-5 text-blue-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* ACADEMIC SCOPE */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              3. Academic Scope
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Leave these blank when AI should select suitable
              content from the selected subjects.
            </p>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  Chapter
                </span>

                <input
                  value={chapter}
                  onChange={(e) =>
                    setChapter(e.target.value)
                  }
                  placeholder="Optional — e.g. Laws of Motion"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  Topic
                </span>

                <input
                  value={topic}
                  onChange={(e) =>
                    setTopic(e.target.value)
                  }
                  placeholder="Optional — e.g. Friction"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>
            </div>
          </section>

          {/* QUESTION REQUIREMENTS */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              4. Question Requirements
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-3">

              <label>
                <span className="text-sm font-semibold text-slate-700">
                  Number of Questions
                </span>

                <input
                  type="number"
                  min={1}
                  max={200}
                  value={questionCount}
                  onChange={(e) =>
                    setQuestionCount(
                      Number(e.target.value)
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                />
              </label>

              <label>
                <span className="text-sm font-semibold text-slate-700">
                  Question Type
                </span>

                <div className="relative mt-2">
                  <select
                    value={questionType}
                    onChange={(e) =>
                      setQuestionType(e.target.value)
                    }
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
                  >
                    <option>NEET MCQ</option>
                    <option>Assertion & Reason</option>
                    <option>Statement Based</option>
                    <option>Numerical Based</option>
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-3 h-5 w-5 text-slate-400" />
                </div>
              </label>

              <label>
                <span className="text-sm font-semibold text-slate-700">
                  Difficulty
                </span>

                <div className="relative mt-2">
                  <select
                    value={difficulty}
                    onChange={(e) =>
                      setDifficulty(e.target.value)
                    }
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
                  >
                    <option>Mixed</option>
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-3 h-5 w-5 text-slate-400" />
                </div>
              </label>
            </div>
          </section>

          {/* TEST CONFIGURATION */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              5. Test Configuration
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">

              <label>
                <span className="text-sm font-semibold text-slate-700">
                  Duration (minutes)
                </span>

                <input
                  type="number"
                  min={1}
                  value={duration}
                  onChange={(e) =>
                    setDuration(
                      Number(e.target.value)
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                />
              </label>

              <label>
                <span className="text-sm font-semibold text-slate-700">
                  Language
                </span>

                <div className="relative mt-2">
                  <select
                    value={language}
                    onChange={(e) =>
                      setLanguage(e.target.value)
                    }
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
                  >
                    <option>English</option>
                    <option>Hindi</option>
                    <option>English + Hindi</option>
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-3 h-5 w-5 text-slate-400" />
                </div>
              </label>
            </div>
          </section>

          {/* AI INSTRUCTIONS */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <BrainCircuit className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  6. AI Instructions
                </h2>

                <p className="text-sm text-slate-500">
                  Add any special instructions for question generation.
                </p>
              </div>
            </div>

            <textarea
              value={instructions}
              onChange={(e) =>
                setInstructions(e.target.value)
              }
              rows={5}
              placeholder="Example: Focus on conceptual questions. Avoid repeated patterns. Include a balanced mix of numerical and application-based questions."
              className="mt-5 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
          </section>

          {/* ACTION */}
          <section className="sticky bottom-4 z-10 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

              <div>
                <p className="text-sm font-bold text-slate-900">
                  Ready to generate?
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {subjects.length} subject(s) •{" "}
                  {questionCount} question(s) •{" "}
                  {difficulty} difficulty
                </p>
              </div>

              <button
                type="button"
                onClick={continueToGeneration}
                disabled={
                  subjects.length === 0 ||
                  questionCount < 1
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Continue to Generate
                <ArrowRight className="h-4 w-4" />
              </button>

            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
