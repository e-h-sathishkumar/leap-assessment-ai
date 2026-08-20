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
  Settings2,
} from "lucide-react";

type Subject =
  | "Physics"
  | "Chemistry"
  | "Botany"
  | "Zoology";

type AssessmentMode =
  | "Full NEET Mock"
  | "Subject Test"
  | "Chapter Test"
  | "Topic Practice"
  | "Custom Test";

type ClassLevel =
  | "Class 11"
  | "Class 12"
  | "Class 11 + 12";

const subjects: Subject[] = [
  "Physics",
  "Chemistry",
  "Botany",
  "Zoology",
];

export default function NEETWorkspace() {
  const router = useRouter();

  const [mode, setMode] =
    useState<AssessmentMode>("Full NEET Mock");

  const [classLevel, setClassLevel] =
    useState<ClassLevel>("Class 11 + 12");

  const [selectedSubjects, setSelectedSubjects] =
    useState<Subject[]>(subjects);

  const [chapter, setChapter] = useState("");
  const [topic, setTopic] = useState("");

  const [totalQuestions, setTotalQuestions] =
    useState(50);

  const [difficulty, setDifficulty] =
    useState("Mixed");

  const [easyPercent, setEasyPercent] =
    useState(30);

  const [mediumPercent, setMediumPercent] =
    useState(50);

  const [hardPercent, setHardPercent] =
    useState(20);

  const [questionType, setQuestionType] =
    useState("NEET MCQ");

  const [duration, setDuration] =
    useState(60);

  const [language, setLanguage] =
    useState("English");

  const [positiveMarks, setPositiveMarks] =
    useState(4);

  const [negativeMarks, setNegativeMarks] =
    useState(1);

  const [instructions, setInstructions] =
    useState("");

  function toggleSubject(subject: Subject) {
    setSelectedSubjects((current) =>
      current.includes(subject)
        ? current.filter((item) => item !== subject)
        : [...current, subject]
    );
  }

  const difficultyTotal =
    easyPercent +
    mediumPercent +
    hardPercent;

  function continueToGeneration() {
    if (!selectedSubjects.length) {
      return;
    }

    if (difficultyTotal !== 100) {
      return;
    }

    const configuration = {
      exam: "NEET",
      framework: "NEET",
      className: classLevel,

      assessmentMode: mode,

      subjects: selectedSubjects,

      chapter: chapter.trim(),
      topic: topic.trim(),

      totalQuestions,
      numberOfQuestions: totalQuestions,

      difficulty,
      difficultyDistribution: {
        easy: easyPercent,
        medium: mediumPercent,
        hard: hardPercent,
      },

      questionType,

      durationMinutes: duration,
      duration,

      positiveMarks,
      negativeMarks,

      language,

      additionalInstructions:
        instructions.trim(),
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
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6">

        {/* BACK */}
        <button
          type="button"
          onClick={() =>
            router.push("/teacher/assessment")
          }
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-emerald-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Assessment Selection
        </button>

        {/* HEADER */}
        <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-600 to-blue-700 p-7 text-white shadow-lg sm:p-9">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                  <GraduationCap className="h-7 w-7" />
                </div>

                <span className="rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold tracking-wide">
                  NEET WORKSPACE
                </span>
              </div>

              <h1 className="text-3xl font-bold sm:text-4xl">
                NEET Assessment Workspace
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-emerald-50 sm:text-base">
                Define the academic and assessment requirements
                before LEAP generates NEET-oriented questions.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
              <p className="text-sm font-bold">
                Assessment Configuration
              </p>

              <p className="mt-2 text-xs text-emerald-100">
                {selectedSubjects.length} subject(s)
                {" • "}
                {totalQuestions} questions
                {" • "}
                {duration} minutes
              </p>
            </div>

          </div>
        </section>

        {/* PROGRESS */}
        <div className="mt-7 grid gap-3 sm:grid-cols-3">

          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-xs font-bold text-emerald-600">
              STEP 01
            </p>
            <p className="mt-1 font-bold text-slate-900">
              Requirements
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-bold text-slate-400">
              STEP 02
            </p>
            <p className="mt-1 font-bold text-slate-500">
              AI Generation
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-bold text-slate-400">
              STEP 03
            </p>
            <p className="mt-1 font-bold text-slate-500">
              Review & Save
            </p>
          </div>

        </div>

        <div className="mt-8 space-y-6">

          {/* 1 ASSESSMENT TYPE */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center gap-3">
              <Settings2 className="h-5 w-5 text-emerald-600" />

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  1. Assessment Type
                </h2>

                <p className="text-sm text-slate-500">
                  Select the purpose of the NEET assessment.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">

              {[
                "Full NEET Mock",
                "Subject Test",
                "Chapter Test",
                "Topic Practice",
                "Custom Test",
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
                      : "border-slate-200 hover:border-emerald-300"
                  }`}
                >
                  <p className="text-sm font-bold text-slate-900">
                    {item}
                  </p>

                  {mode === item && (
                    <CheckCircle2 className="mt-3 h-5 w-5 text-emerald-600" />
                  )}
                </button>
              ))}

            </div>
          </section>

          {/* 2 CLASS */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-bold text-slate-900">
              2. Academic Level
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select the class level from which questions should be generated.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">

              {[
                "Class 11",
                "Class 12",
                "Class 11 + 12",
              ].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    setClassLevel(item as ClassLevel)
                  }
                  className={`rounded-xl border p-4 text-left font-semibold transition ${
                    classLevel === item
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 text-slate-700 hover:border-blue-300"
                  }`}
                >
                  {item}
                </button>
              ))}

            </div>
          </section>

          {/* 3 SUBJECTS */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-bold text-slate-900">
              3. Subjects
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select one or more NEET subjects.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {subjects.map((subject) => {
                const selected =
                  selectedSubjects.includes(subject);

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
                        : "border-slate-200 hover:border-blue-300"
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

          {/* 4 ACADEMIC SCOPE */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-bold text-slate-900">
              4. Academic Scope
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Optional. Leave blank when LEAP should determine
              suitable content automatically.
            </p>

            <div className="mt-5 grid gap-5 md:grid-cols-2">

              <label>
                <span className="text-sm font-semibold text-slate-700">
                  Chapter
                </span>

                <input
                  value={chapter}
                  onChange={(e) =>
                    setChapter(e.target.value)
                  }
                  placeholder="Example: Laws of Motion"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>

              <label>
                <span className="text-sm font-semibold text-slate-700">
                  Topic
                </span>

                <input
                  value={topic}
                  onChange={(e) =>
                    setTopic(e.target.value)
                  }
                  placeholder="Example: Friction"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>

            </div>
          </section>

          {/* 5 QUESTION BLUEPRINT */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                5. Question Blueprint
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Define how LEAP should construct the question set.
              </p>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-3">

              <label>
                <span className="text-sm font-semibold text-slate-700">
                  Total Questions
                </span>

                <input
                  type="number"
                  min={1}
                  max={200}
                  value={totalQuestions}
                  onChange={(e) =>
                    setTotalQuestions(
                      Number(e.target.value)
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                />
              </label>

              <label>
                <span className="text-sm font-semibold text-slate-700">
                  Difficulty Mode
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
                    <option>Statement Based</option>
                    <option>Assertion & Reason</option>
                    <option>Numerical Based</option>
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-3 h-5 w-5 text-slate-400" />
                </div>
              </label>

            </div>

            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">

              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div>
                  <p className="font-bold text-slate-900">
                    Difficulty Distribution
                  </p>

                  <p className="text-xs text-slate-500">
                    Total must equal 100%.
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    difficultyTotal === 100
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {difficultyTotal}%
                </span>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-3">

                <label>
                  <span className="text-sm font-semibold text-slate-700">
                    Easy %
                  </span>

                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={easyPercent}
                    onChange={(e) =>
                      setEasyPercent(
                        Number(e.target.value)
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
                  />
                </label>

                <label>
                  <span className="text-sm font-semibold text-slate-700">
                    Medium %
                  </span>

                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={mediumPercent}
                    onChange={(e) =>
                      setMediumPercent(
                        Number(e.target.value)
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
                  />
                </label>

                <label>
                  <span className="text-sm font-semibold text-slate-700">
                    Hard %
                  </span>

                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={hardPercent}
                    onChange={(e) =>
                      setHardPercent(
                        Number(e.target.value)
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
                  />
                </label>

              </div>
            </div>
          </section>

          {/* 6 TEST SETTINGS */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-bold text-slate-900">
              6. Test Settings
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-4">

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
                  Positive Marks
                </span>

                <input
                  type="number"
                  value={positiveMarks}
                  onChange={(e) =>
                    setPositiveMarks(
                      Number(e.target.value)
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                />
              </label>

              <label>
                <span className="text-sm font-semibold text-slate-700">
                  Negative Marks
                </span>

                <input
                  type="number"
                  value={negativeMarks}
                  onChange={(e) =>
                    setNegativeMarks(
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

          {/* 7 AI INSTRUCTIONS */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <BrainCircuit className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  7. AI Instructions
                </h2>

                <p className="text-sm text-slate-500">
                  Optional instructions for question generation.
                </p>
              </div>

            </div>

            <textarea
              value={instructions}
              onChange={(e) =>
                setInstructions(e.target.value)
              }
              rows={5}
              placeholder="Example: Focus on conceptual understanding, avoid repetitive patterns, include application-oriented questions and maintain NEET-level difficulty."
              className="mt-5 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />

          </section>

          {/* SUMMARY + ACTION */}
          <section className="sticky bottom-4 z-10 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <p className="font-bold text-slate-900">
                  NEET Assessment Summary
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {mode}
                  {" • "}
                  {classLevel}
                  {" • "}
                  {selectedSubjects.length} subject(s)
                  {" • "}
                  {totalQuestions} questions
                  {" • "}
                  {duration} minutes
                </p>

                {difficultyTotal !== 100 && (
                  <p className="mt-1 text-xs font-semibold text-red-600">
                    Difficulty distribution must total 100%.
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={continueToGeneration}
                disabled={
                  selectedSubjects.length === 0 ||
                  totalQuestions < 1 ||
                  difficultyTotal !== 100
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
