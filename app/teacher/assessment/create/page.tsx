"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronDown,
  Clock,
  Download,
  FileText,
  Loader2,
  Sparkles,
  Target,
} from "lucide-react";


import {
  getSubjects,
  getChapters,
  getTopics,
} from "@/services/repository.service";

interface Subject {
  id: number;
  name: string;
}

interface Chapter {
  id: number;
  subject_id: number;
  name: string;
}

interface Topic {
  id: number;
  chapter_id: number;
  name: string;
}

interface SelectedTopic {
  topicId: number;
  topicName: string;
}

interface SelectedChapter {
  chapterId: number;
  chapterName: string;
  topics: SelectedTopic[];
}

interface SelectedSubject {
  subjectId: number;
  subjectName: string;
  chapters: SelectedChapter[];
}

export default function CreateAssessmentPage() {
  const router = useRouter();
  const [testSaved, setTestSaved] = useState(false);
  // =========================================================
  // BASIC ASSESSMENT DETAILS
  // =========================================================

  const [exam, setExam] = useState("NEET");

  const [className, setClassName] =
    useState("Class 11");

  const [testTitle, setTestTitle] =
    useState("");

  // =========================================================
  // REPOSITORY
  // =========================================================

  const [subjects, setSubjects] =
    useState<Subject[]>([]);

  const [selectedSubjects, setSelectedSubjects] =
    useState<SelectedSubject[]>([]);

  const [chapters, setChapters] =
    useState<Record<number, Chapter[]>>({});

  const [topics, setTopics] =
    useState<Record<number, Topic[]>>({});

  const [expandedSubjects, setExpandedSubjects] =
    useState<number[]>([]);

  const [expandedChapters, setExpandedChapters] =
    useState<number[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =========================================================
  // AI SETTINGS
  // =========================================================

  const [questionTypes, setQuestionTypes] =
    useState<string[]>(["MCQ"]);

  const [difficulty, setDifficulty] =
    useState("Medium");

  const [numberOfQuestions, setNumberOfQuestions] =
    useState(10);

  const [durationMinutes, setDurationMinutes] =
    useState(30);

  const [instructions, setInstructions] =
    useState("");

  // =========================================================
  // LOAD SUBJECTS
  // =========================================================

  useEffect(() => {
    async function loadSubjects() {
      try {
        setLoading(true);

        const data = await getSubjects();

        setSubjects(
          (data || []) as Subject[]
        );
      } catch (err) {
        console.error(err);

        setError(
          "Unable to load subjects from Repository."
        );
      } finally {
        setLoading(false);
      }
    }

    loadSubjects();
  }, []);

  // =========================================================
  // SUBJECT SELECTION
  // =========================================================

  async function selectSubject(
    subject: Subject
  ) {
    const exists =
      selectedSubjects.some(
        (item) =>
          item.subjectId === subject.id
      );

    if (exists) {
      setSelectedSubjects(
        selectedSubjects.filter(
          (item) =>
            item.subjectId !== subject.id
        )
      );

      return;
    }

    try {
      const data =
        await getChapters(
          String(subject.id)
        );

      setChapters((current) => ({
        ...current,
        [subject.id]:
          (data || []) as Chapter[],
      }));

      setSelectedSubjects([
        ...selectedSubjects,
        {
          subjectId: subject.id,
          subjectName: subject.name,
          chapters: [],
        },
      ]);

      setExpandedSubjects(
        (current) => [
          ...current,
          subject.id,
        ]
      );
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load chapters."
      );
    }
  }

  // =========================================================
  // CHAPTER SELECTION
  // =========================================================

  async function selectChapter(
    subjectId: number,
    chapter: Chapter
  ) {
    const subject =
      selectedSubjects.find(
        (item) =>
          item.subjectId === subjectId
      );

    if (!subject) return;

    const exists =
      subject.chapters.some(
        (item) =>
          item.chapterId === chapter.id
      );

    // -------------------------------------------------------
    // UNSELECT CHAPTER
    // -------------------------------------------------------

    if (exists) {
      setSelectedSubjects(
        selectedSubjects.map(
          (item) =>
            item.subjectId === subjectId
              ? {
                  ...item,
                  chapters:
                    item.chapters.filter(
                      (c) =>
                        c.chapterId !==
                        chapter.id
                    ),
                }
              : item
        )
      );

      return;
    }

    // -------------------------------------------------------
    // SELECT CHAPTER
    // -------------------------------------------------------

    try {
      const data =
        await getTopics(
          String(chapter.id)
        );

      setTopics((current) => ({
        ...current,
        [chapter.id]:
          (data || []) as Topic[],
      }));

      setSelectedSubjects(
        selectedSubjects.map(
          (item) =>
            item.subjectId === subjectId
              ? {
                  ...item,
                  chapters: [
                    ...item.chapters,
                    {
                      chapterId:
                        chapter.id,
                      chapterName:
                        chapter.name,
                      topics: [],
                    },
                  ],
                }
              : item
        )
      );

      setExpandedChapters(
        (current) => [
          ...current,
          chapter.id,
        ]
      );
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load topics."
      );
    }
  }

  // =========================================================
  // TOPIC SELECTION
  // =========================================================

  function selectTopic(
    subjectId: number,
    chapterId: number,
    topic: Topic
  ) {
    setSelectedSubjects(
      selectedSubjects.map(
        (subject) => {
          if (
            subject.subjectId !==
            subjectId
          ) {
            return subject;
          }

          return {
            ...subject,

            chapters:
              subject.chapters.map(
                (chapter) => {
                  if (
                    chapter.chapterId !==
                    chapterId
                  ) {
                    return chapter;
                  }

                  const exists =
                    chapter.topics.some(
                      (item) =>
                        item.topicId ===
                        topic.id
                    );

                  return {
                    ...chapter,

                    topics: exists
                      ? chapter.topics.filter(
                          (item) =>
                            item.topicId !==
                            topic.id
                        )
                      : [
                          ...chapter.topics,
                          {
                            topicId:
                              topic.id,
                            topicName:
                              topic.name,
                          },
                        ],
                  };
                }
              ),
          };
        }
      )
    );
  }

  // =========================================================
  // QUESTION TYPE
  // =========================================================

  function toggleQuestionType(
    type: string
  ) {
    setQuestionTypes(
      (current) =>
        current.includes(type)
          ? current.filter(
              (item) =>
                item !== type
            )
          : [
              ...current,
              type,
            ]
    );
  }

  // =========================================================
  // CONTINUE TO AI QUESTIONS
  // =========================================================

  function continueToQuestions() {
  setError("");

  // =========================================================
  // REQUIRED: TEST TITLE
  // =========================================================

  if (!testTitle.trim()) {
    setError("Please enter a test title.");
    return;
  }

  // =========================================================
  // REQUIRED: EXAM
  // =========================================================

  if (!exam.trim()) {
    setError("Please select an exam / framework.");
    return;
  }

  // =========================================================
  // REQUIRED: CLASS
  // =========================================================

  if (!className.trim()) {
    setError("Please select a class.");
    return;
  }

  // =========================================================
  // REQUIRED: SUBJECT
  // =========================================================

  if (selectedSubjects.length === 0) {
    setError("Please select at least one subject.");
    return;
  }

  // =========================================================
  // CHAPTER AND TOPIC ARE OPTIONAL
  // =========================================================

  // No chapter validation.
  // No topic validation.
  //
  // AI can generate using:
  //
  // Exam + Class + Subject
  //
  // Chapter and Topic are only refinement filters.

  // =========================================================
  // QUESTION TYPE
  // =========================================================

  if (questionTypes.length === 0) {
    setError("Please select at least one question type.");
    return;
  }

  // =========================================================
  // NUMBER OF QUESTIONS
  // =========================================================

  if (
    numberOfQuestions < 1 ||
    numberOfQuestions > 200
  ) {
    setError(
      "Number of questions must be between 1 and 200."
    );
    return;
  }

  // =========================================================
  // DURATION
  // =========================================================

  if (
    durationMinutes < 1 ||
    durationMinutes > 300
  ) {
    setError(
      "Duration must be between 1 and 300 minutes."
    );
    return;
  }

  // =========================================================
  // CREATE NEW CONFIGURATION
  // =========================================================

  const configuration = {
    exam,

    className,

    testTitle:
      testTitle.trim(),

    subjects:
      selectedSubjects,

    questionTypes,

    difficulty,

    totalQuestions:
      numberOfQuestions,

    numberOfQuestions,

    durationMinutes,

    duration:
      durationMinutes,

    additionalInstructions:
      instructions.trim(),

    hierarchyMode:
      "subject-first",

    chapterOptional:
      true,

    topicOptional:
      true,

    createdAt:
      new Date().toISOString(),
  };

  // =========================================================
  // DEBUG
  // =========================================================

  console.log(
    "========== LEAP NEW ASSESSMENT =========="
  );

  console.log(
    configuration
  );

  // =========================================================
  // CLEAR OLD QUESTIONS
  // =========================================================

  sessionStorage.removeItem(
    "leap_generated_questions"
  );

  // Remove old configuration format
  sessionStorage.removeItem(
    "leap_assessment_config"
  );

  // =========================================================
  // SAVE NEW CONFIGURATION
  // =========================================================

  sessionStorage.setItem(
    "leap_test_configuration",
    JSON.stringify(configuration)
  );

  console.log(
    "Old questions cleared."
  );

  console.log(
    "New assessment configuration saved."
  );

  console.log(
    "========================================="
  );

  // =========================================================
  // GO TO QUESTIONS PAGE
  // =========================================================

  router.push(
    "/teacher/assessment/questions"
  );
}

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />

          <p className="text-sm font-medium text-slate-600">
            Loading Repository...
          </p>
        </div>
      </main>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <main className="min-h-screen bg-slate-50">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="border-b bg-white shadow-sm">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div className="flex items-center gap-4">

            <button
              type="button"
              onClick={() =>
                router.back()
              }
              className="rounded-lg p-2 hover:bg-slate-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div>

              <h1 className="text-2xl font-bold text-slate-900">
                Create Test
              </h1>

              <p className="text-sm text-slate-500">
                Configure your assessment before AI generation
              </p>

            </div>

          </div>

          <div className="flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">

            <Sparkles className="h-4 w-4" />

            AI Assessment

          </div>

        </div>

      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ===================================================
            ASSESSMENT DETAILS
        =================================================== */}

        <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center gap-3">

            <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600">
              <FileText className="h-5 w-5" />
            </div>

            <div>

              <h2 className="font-bold">
                Assessment Details
              </h2>

              <p className="text-sm text-slate-500">
                Define the basic assessment information.
              </p>

            </div>

          </div>

          <div className="grid gap-5 md:grid-cols-3">

            <Field label="Exam / Framework">

              <select
                value={exam}
                onChange={(e) =>
                  setExam(
                    e.target.value
                  )
                }
                className="input"
              >
                <option>CBSE</option>
                <option>NEET</option>
                <option>JEE Main</option>
                <option>JEE Advanced</option>
              </select>

            </Field>

            <Field label="Class">

              <select
                value={className}
                onChange={(e) =>
                  setClassName(
                    e.target.value
                  )
                }
                className="input"
              >
                {[
                  "Class 6",
                  "Class 7",
                  "Class 8",
                  "Class 9",
                  "Class 10",
                  "Class 11",
                  "Class 12",
                ].map(
                  (item) => (
                    <option
                      key={item}
                    >
                      {item}
                    </option>
                  )
                )}
              </select>

            </Field>

            <Field label="Test Title">

              <input
                value={testTitle}
                onChange={(e) =>
                  setTestTitle(
                    
                    e.target.value
                  )
                }
                placeholder="Enter test title"
                className="input"
              />

            </Field>

          </div>

        </section>

        {/* ===================================================
            ACADEMIC SCOPE
        =================================================== */}

        <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center gap-3">

            <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
              <BookOpen className="h-5 w-5" />
            </div>

            <div>

              <h2 className="font-bold">
                Academic Scope
              </h2>

              <p className="text-sm text-slate-500">
                Select subjects from Repository.
                Chapter and Topic are optional.
              </p>

            </div>

          </div>

          {/* =================================================
              SUBJECTS
          ================================================= */}

          <div className="mb-5 rounded-xl border border-blue-100 bg-blue-50 p-4">

            <div className="flex items-start gap-3">

              <div className="mt-0.5 rounded-lg bg-blue-600 p-1.5 text-white">
                <Check className="h-4 w-4" />
              </div>

              <div>

                <p className="text-sm font-semibold text-blue-900">
                  Subject is required
                </p>

                <p className="mt-1 text-xs leading-5 text-blue-700">
                  Chapter and Topic are optional.
                  If you do not select them, LEAP AI
                  will choose suitable academic content
                  using the selected Exam, Class and Subject.
                </p>

              </div>

            </div>

          </div>

          {loading ? (
            <div className="flex items-center gap-2 text-sm text-slate-500">

              <Loader2 className="h-4 w-4 animate-spin" />

              Loading Repository...

            </div>
          ) : (

            <div className="grid gap-3 md:grid-cols-3">

              {subjects.map(
                (subject) => {

                  const selected =
                    selectedSubjects.some(
                      (item) =>
                        item.subjectId ===
                        subject.id
                    );

                  return (
                    <button
                      key={subject.id}
                      type="button"
                      onClick={() =>
                        selectSubject(
                          subject
                        )
                      }
                      className={`rounded-xl border p-4 text-left ${
                        selected
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >

                      <div className="flex items-center gap-3">

                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-md border ${
                            selected
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-slate-300"
                          }`}
                        >
                          {selected && (
                            <Check className="h-4 w-4" />
                          )}
                        </div>

                        <span className="font-semibold">
                          {subject.name}
                        </span>

                      </div>

                    </button>
                  );
                }
              )}

            </div>

          )}

          {/* =================================================
              SELECTED SUBJECTS
          ================================================= */}

          <div className="mt-6 space-y-4">

            {selectedSubjects.map(
              (subject) => {

                const subjectChapters =
                  chapters[
                    subject.subjectId
                  ] || [];

                const subjectExpanded =
                  expandedSubjects.includes(
                    subject.subjectId
                  );

                return (
                  <div
                    key={
                      subject.subjectId
                    }
                    className="rounded-xl border border-slate-200"
                  >

                    {/* SUBJECT HEADER */}

                    <button
                      type="button"
                      onClick={() =>
                        setExpandedSubjects(
                          (current) =>
                            current.includes(
                              subject.subjectId
                            )
                              ? current.filter(
                                  (id) =>
                                    id !==
                                    subject.subjectId
                                )
                              : [
                                  ...current,
                                  subject.subjectId,
                                ]
                        )
                      }
                      className="flex w-full items-center justify-between bg-slate-50 p-4 text-left"
                    >

                      <div>

                        <p className="font-bold">
                          {subject.subjectName}
                        </p>

                        <p className="text-xs text-slate-500">
                          {subject.chapters.length}{" "}
                          chapters selected
                        </p>

                      </div>

                      <ChevronDown
                        className={`h-5 w-5 ${
                          subjectExpanded
                            ? "rotate-180"
                            : ""
                        }`}
                      />

                    </button>

                    {/* CHAPTERS */}

                    {subjectExpanded && (

                      <div className="space-y-3 p-4">

                        {/* OPTIONAL MESSAGE */}

                        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3">

                          <p className="text-xs font-medium text-slate-600">
                            Chapter selection is optional.
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Leave all chapters unselected
                            and AI will choose appropriate
                            content from this subject.
                          </p>

                        </div>

                        {subjectChapters.map(
                          (chapter) => {

                            const selectedChapter =
                              subject.chapters.find(
                                (item) =>
                                  item.chapterId ===
                                  chapter.id
                              );

                            const chapterSelected =
                              !!selectedChapter;

                            const chapterExpanded =
                              expandedChapters.includes(
                                chapter.id
                              );

                            const chapterTopics =
                              topics[
                                chapter.id
                              ] || [];

                            return (
                              <div
                                key={
                                  chapter.id
                                }
                                className="rounded-xl border border-slate-200"
                              >

                                <div className="flex items-center gap-3 p-3">

                                  <input
                                    type="checkbox"
                                    checked={
                                      chapterSelected
                                    }
                                    onChange={() =>
                                      selectChapter(
                                        subject.subjectId,
                                        chapter
                                      )
                                    }
                                    className="h-4 w-4"
                                  />

                                  <button
                                    type="button"
                                    disabled={
                                      !chapterSelected
                                    }
                                    onClick={() =>
                                      setExpandedChapters(
                                        (current) =>
                                          current.includes(
                                            chapter.id
                                          )
                                            ? current.filter(
                                                (
                                                  id
                                                ) =>
                                                  id !==
                                                  chapter.id
                                              )
                                            : [
                                                ...current,
                                                chapter.id,
                                              ]
                                      )
                                    }
                                    className="flex flex-1 items-center justify-between text-left"
                                  >

                                    <div>

                                      <p className="font-medium">
                                        {chapter.name}
                                      </p>

                                      {chapterSelected && (
                                        <p className="text-xs text-indigo-600">
                                          {
                                            selectedChapter
                                              ?.topics
                                              .length
                                          }{" "}
                                          topics selected
                                        </p>
                                      )}

                                    </div>

                                    <ChevronDown
                                      className={`h-4 w-4 ${
                                        chapterExpanded
                                          ? "rotate-180"
                                          : ""
                                      }`}
                                    />

                                  </button>

                                </div>

                                {/* TOPICS */}

                                {chapterSelected &&
                                  chapterExpanded && (

                                    <div className="border-t p-4">

                                      <div className="mb-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3">

                                        <p className="text-xs font-medium text-slate-600">
                                          Topic selection is optional.
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                          Leave topics unselected
                                          and AI will choose suitable
                                          concepts from this chapter.
                                        </p>

                                      </div>

                                      {chapterTopics.length ===
                                      0 ? (

                                        <p className="text-xs text-slate-500">
                                          No topics found.
                                        </p>

                                      ) : (

                                        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">

                                          {chapterTopics.map(
                                            (topic) => {

                                              const checked =
                                                selectedChapter?.topics.some(
                                                  (
                                                    item
                                                  ) =>
                                                    item.topicId ===
                                                    topic.id
                                                ) ||
                                                false;

                                              return (
                                                <label
                                                  key={
                                                    topic.id
                                                  }
                                                  className={`flex cursor-pointer gap-2 rounded-lg border p-3 text-sm ${
                                                    checked
                                                      ? "border-indigo-300 bg-indigo-50"
                                                      : "border-slate-200"
                                                  }`}
                                                >

                                                  <input
                                                    type="checkbox"
                                                    checked={
                                                      checked
                                                    }
                                                    onChange={() =>
                                                      selectTopic(
                                                        subject.subjectId,
                                                        chapter.id,
                                                        topic
                                                      )
                                                    }
                                                  />

                                                  {topic.name}

                                                </label>
                                              );
                                            }
                                          )}

                                        </div>

                                      )}

                                    </div>

                                  )}

                              </div>
                            );
                          }
                        )}

                      </div>

                    )}

                  </div>
                );
              }
            )}

          </div>

        </section>

        {/* ===================================================
            AI SETTINGS
        =================================================== */}

        <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center gap-3">

            <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
              <Target className="h-5 w-5" />
            </div>

            <div>

              <h2 className="font-bold">
                AI Question Instructions
              </h2>

              <p className="text-sm text-slate-500">
                These instructions will be passed to the AI.
              </p>

            </div>

          </div>

          {/* QUESTION TYPES */}

          <div className="mb-6">

            <label className="mb-3 block text-sm font-semibold">
              Question Types
            </label>

            <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-4">

              {[
                "MCQ",
                "Assertion & Reason",
                "Case Based",
                "Multiple Correct",
                "Numerical",
                "Integer",
                "Match the Following",
              ].map(
                (type) => {

                  const checked =
                    questionTypes.includes(
                      type
                    );

                  return (
                    <label
                      key={type}
                      className={`flex cursor-pointer gap-2 rounded-lg border p-3 text-sm ${
                        checked
                          ? "border-purple-300 bg-purple-50"
                          : "border-slate-200"
                      }`}
                    >

                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          toggleQuestionType(
                            type
                          )
                        }
                      />

                      {type}

                    </label>
                  );
                }
              )}

            </div>

          </div>

          {/* DIFFICULTY / QUESTIONS / DURATION */}

          <div className="grid gap-5 md:grid-cols-3">

            <Field label="Difficulty">

              <select
                value={difficulty}
                onChange={(e) =>
                  setDifficulty(
                    e.target.value
                  )
                }
                className="input"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
                <option>Mixed</option>
              </select>

            </Field>

            <Field label="Number of Questions">

              <input
                type="number"
                min={1}
                max={200}
                value={numberOfQuestions}
                onChange={(e) =>
                  setNumberOfQuestions(
                    Number(
                      e.target.value
                    )
                  )
                }
                className="input"
              />

            </Field>

            <Field label="Duration (minutes)">

              <div className="relative">

                <Clock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

                <input
                  type="number"
                  min={1}
                  max={300}
                  value={durationMinutes}
                  onChange={(e) =>
                    setDurationMinutes(
                      Number(
                        e.target.value
                      )
                    )
                  }
                  className="input pl-9"
                />

              </div>

            </Field>

          </div>

          {/* ADDITIONAL INSTRUCTIONS */}

          <div className="mt-6">

            <label className="mb-2 block text-sm font-semibold">
              Additional AI Instructions
            </label>

            <p className="mb-2 text-xs text-slate-500">
              Optional. Add any special requirements,
              restrictions, focus areas or instructions
              for the AI.
            </p>

            <textarea
              value={instructions}
              onChange={(e) =>
                setInstructions(
                  e.target.value
                )
              }
              rows={5}
              placeholder="Example: Focus on competency-based questions. Include application-oriented questions. Avoid questions requiring diagrams."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none focus:border-indigo-500"
            />

          </div>

        </section>

        {/* ===================================================
            ACTION
        =================================================== */}

        <div className="flex justify-between">

          <button
            type="button"
            onClick={() =>
              router.back()
            }
            className="rounded-xl border bg-white px-6 py-3 font-semibold"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={
              continueToQuestions
            }
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-7 py-3 font-bold text-white hover:bg-indigo-700"
          >

            Generate Questions with AI

            <Sparkles className="h-4 w-4" />

          </button>

        </div>

      </div>

    </main>
  );
}

// ===========================================================
// FIELD COMPONENT
// ===========================================================

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      {children}

    </div>
  );
}
