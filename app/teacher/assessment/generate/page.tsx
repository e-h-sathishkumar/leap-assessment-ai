"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Clock,
  FileText,
  Loader2,
  Sparkles,
  Target,
  X,
} from "lucide-react";

import {
  getSubjects,
  getChapters,
  getTopics,
} from "@/services/repository.service";

interface Subject {
  id: number;
  name: string;
  code?: string | null;
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

const EXAMS = [
  "CBSE",
  "NEET",
  "JEE Main",
  "JEE Advanced",
];

const CLASSES = [
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "Class 11",
  "Class 12",
];

const QUESTION_TYPES = [
  "MCQ",
  "Assertion & Reason",
  "Case Based",
  "Multiple Correct",
  "Numerical",
  "Integer",
  "Match the Following",
  "Very Short",
  "Short Answer",
  "Long Answer",
];

const DIFFICULTIES = [
  "Easy",
  "Medium",
  "Hard",
  "Mixed",
];

const BLOOM_LEVELS = [
  "Auto",
  "Remember",
  "Understand",
  "Apply",
  "Analyze",
  "Evaluate",
  "Create",
];

export default function CreateAssessmentPage() {
  const router = useRouter();

  /* ---------------------------------------------------------
     BASIC DETAILS
  --------------------------------------------------------- */

  const [exam, setExam] = useState("NEET");
  const [className, setClassName] = useState("Class 11");
  const [testTitle, setTestTitle] = useState("");

  /* ---------------------------------------------------------
     REPOSITORY
  --------------------------------------------------------- */

  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [selectedSubjects, setSelectedSubjects] =
    useState<SelectedSubject[]>([]);

  const [chaptersBySubject, setChaptersBySubject] =
    useState<Record<number, Chapter[]>>({});

  const [topicsByChapter, setTopicsByChapter] =
    useState<Record<number, Topic[]>>({});

  const [expandedSubjects, setExpandedSubjects] =
    useState<number[]>([]);

  const [expandedChapters, setExpandedChapters] =
    useState<number[]>([]);

  /* ---------------------------------------------------------
     QUESTION SETTINGS
  --------------------------------------------------------- */

  const [questionTypes, setQuestionTypes] =
    useState<string[]>(["MCQ"]);

  const [difficulty, setDifficulty] =
    useState("Medium");

  const [bloom, setBloom] =
    useState("Auto");

  const [numberOfQuestions, setNumberOfQuestions] =
    useState(10);

  const [durationMinutes, setDurationMinutes] =
    useState(30);

  const [additionalInstructions, setAdditionalInstructions] =
    useState("");

  /* ---------------------------------------------------------
     UI STATE
  --------------------------------------------------------- */

  const [loadingSubjects, setLoadingSubjects] =
    useState(true);

  const [loadingChapters, setLoadingChapters] =
    useState<number | null>(null);

  const [loadingTopics, setLoadingTopics] =
    useState<number | null>(null);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  /* =========================================================
     LOAD SUBJECTS
  ========================================================= */

  useEffect(() => {
    async function loadSubjects() {
      try {
        setLoadingSubjects(true);

        const data = await getSubjects();

        setSubjects(
          (data ?? []) as Subject[]
        );
      } catch (err) {
        console.error(
          "Subject loading error:",
          err
        );

        setError(
          "Unable to load subjects from the academic repository."
        );
      } finally {
        setLoadingSubjects(false);
      }
    }

    loadSubjects();
  }, []);

  /* =========================================================
     LOAD CHAPTERS
  ========================================================= */

  async function loadChapters(
    subjectId: number
  ) {
    if (chaptersBySubject[subjectId]) {
      return chaptersBySubject[subjectId];
    }

    try {
      setLoadingChapters(subjectId);

      const data = await getChapters(
        String(subjectId)
      );

      const chapters =
        (data ?? []) as Chapter[];

      setChaptersBySubject(
        (current) => ({
          ...current,
          [subjectId]: chapters,
        })
      );

      return chapters;
    } catch (err) {
      console.error(
        "Chapter loading error:",
        err
      );

      setError(
        "Unable to load chapters."
      );

      return [];
    } finally {
      setLoadingChapters(null);
    }
  }

  /* =========================================================
     LOAD TOPICS
  ========================================================= */

  async function loadTopics(
    chapterId: number
  ) {
    if (topicsByChapter[chapterId]) {
      return topicsByChapter[chapterId];
    }

    try {
      setLoadingTopics(chapterId);

      const data = await getTopics(
        String(chapterId)
      );

      const topics =
        (data ?? []) as Topic[];

      setTopicsByChapter(
        (current) => ({
          ...current,
          [chapterId]: topics,
        })
      );

      return topics;
    } catch (err) {
      console.error(
        "Topic loading error:",
        err
      );

      setError(
        "Unable to load topics."
      );

      return [];
    } finally {
      setLoadingTopics(null);
    }
  }

  /* =========================================================
     SUBJECT SELECTION
  ========================================================= */

  async function toggleSubject(
    subject: Subject
  ) {
    setError("");

    const alreadySelected =
      selectedSubjects.some(
        (item) =>
          item.subjectId === subject.id
      );

    if (alreadySelected) {
      setSelectedSubjects(
        selectedSubjects.filter(
          (item) =>
            item.subjectId !== subject.id
        )
      );

      setExpandedSubjects(
        expandedSubjects.filter(
          (id) => id !== subject.id
        )
      );

      return;
    }

    setSelectedSubjects([
      ...selectedSubjects,
      {
        subjectId: subject.id,
        subjectName: subject.name,
        chapters: [],
      },
    ]);

    setExpandedSubjects([
      ...expandedSubjects,
      subject.id,
    ]);

    await loadChapters(subject.id);
  }

  /* =========================================================
     CHAPTER SELECTION
  ========================================================= */

  async function toggleChapter(
    subjectId: number,
    chapter: Chapter
  ) {
    setError("");

    const subject =
      selectedSubjects.find(
        (item) =>
          item.subjectId === subjectId
      );

    if (!subject) return;

    const alreadySelected =
      subject.chapters.some(
        (item) =>
          item.chapterId === chapter.id
      );

    if (alreadySelected) {
      setSelectedSubjects(
        selectedSubjects.map(
          (item) =>
            item.subjectId === subjectId
              ? {
                  ...item,
                  chapters:
                    item.chapters.filter(
                      (chapterItem) =>
                        chapterItem.chapterId !==
                        chapter.id
                    ),
                }
              : item
        )
      );

      return;
    }

    setSelectedSubjects(
      selectedSubjects.map(
        (item) =>
          item.subjectId === subjectId
            ? {
                ...item,
                chapters: [
                  ...item.chapters,
                  {
                    chapterId: chapter.id,
                    chapterName: chapter.name,
                    topics: [],
                  },
                ],
              }
            : item
      )
    );

    await loadTopics(chapter.id);

    setExpandedChapters(
      (current) =>
        current.includes(chapter.id)
          ? current
          : [...current, chapter.id]
    );
  }

  /* =========================================================
     TOPIC SELECTION
  ========================================================= */

  function toggleTopic(
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
                            topicId: topic.id,
                            topicName: topic.name,
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

  /* =========================================================
     QUESTION TYPE
  ========================================================= */

  function toggleQuestionType(
    type: string
  ) {
    setQuestionTypes(
      (current) =>
        current.includes(type)
          ? current.filter(
              (item) => item !== type
            )
          : [...current, type]
    );
  }

  /* =========================================================
     COUNTS
  ========================================================= */

  const selectedChapterCount =
    useMemo(
      () =>
        selectedSubjects.reduce(
          (total, subject) =>
            total +
            subject.chapters.length,
          0
        ),
      [selectedSubjects]
    );

  const selectedTopicCount =
    useMemo(
      () =>
        selectedSubjects.reduce(
          (total, subject) =>
            total +
            subject.chapters.reduce(
              (
                chapterTotal,
                chapter
              ) =>
                chapterTotal +
                chapter.topics.length,
              0
            ),
          0
        ),
      [selectedSubjects]
    );

  /* =========================================================
     VALIDATE
  ========================================================= */

  function validate() {
    if (!testTitle.trim()) {
      return "Please enter a test title.";
    }

    if (
      selectedSubjects.length ===
      0
    ) {
      return "Please select at least one subject.";
    }

    if (
      selectedChapterCount === 0
    ) {
      return "Please select at least one chapter.";
    }

    if (
      selectedTopicCount === 0
    ) {
      return "Please select at least one topic.";
    }

    if (
      questionTypes.length === 0
    ) {
      return "Please select at least one question type.";
    }

    if (
      numberOfQuestions < 1 ||
      numberOfQuestions > 200
    ) {
      return "Number of questions must be between 1 and 200.";
    }

    if (
      durationMinutes < 1 ||
      durationMinutes > 300
    ) {
      return "Duration must be between 1 and 300 minutes.";
    }

    return "";
  }

  /* =========================================================
     SAVE CONFIGURATION FOR QUESTIONS PAGE
  ========================================================= */

  function buildConfiguration() {
    return {
      exam,
      className,

      title: testTitle.trim(),
      testTitle: testTitle.trim(),

      subjects:
        selectedSubjects.map(
          (subject) => ({
            subjectId:
              subject.subjectId,

            subjectName:
              subject.subjectName,

            chapters:
              subject.chapters.map(
                (chapter) => ({
                  chapterId:
                    chapter.chapterId,

                  chapterName:
                    chapter.chapterName,

                  topics:
                    chapter.topics.map(
                      (topic) => ({
                        topicId:
                          topic.topicId,

                        topicName:
                          topic.topicName,
                      })
                    ),
                })
              ),
          })
        ),

      questionTypes,

      difficulty,

      bloom,

      numberOfQuestions,

      totalQuestions:
        numberOfQuestions,

      durationMinutes,

      duration:
        durationMinutes,

      additionalInstructions:
        additionalInstructions.trim(),

      createdAt:
        new Date().toISOString(),
    };
  }

  /* =========================================================
     CONTINUE TO AI QUESTIONS
  ========================================================= */

  function handleContinue() {
    const validationError =
      validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError("");

    try {
      const configuration =
        buildConfiguration();

      sessionStorage.setItem(
        "leap_test_configuration",
        JSON.stringify(
          configuration
        )
      );

      router.push(
        "/teacher/assessment/questions"
      );
    } catch (err) {
      console.error(err);

      setError(
        "Unable to prepare the assessment."
      );

      setSaving(false);
    }
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <main className="min-h-screen bg-slate-50">

      {/* HEADER */}

      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div className="flex items-center gap-4">

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/teacher/dashboard"
                )
              }
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Create Test
              </h1>

              <p className="text-sm text-slate-500">
                Configure your assessment and generate questions with AI
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

        {/* ERROR */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

            <X className="mt-0.5 h-5 w-5" />

            <div className="flex-1">
              {error}
            </div>

            <button
              type="button"
              onClick={() =>
                setError("")
              }
            >
              <X className="h-4 w-4" />
            </button>

          </div>
        )}

        {/* STEP 1 */}

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <FileText className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-indigo-600">
                Step 1
              </p>

              <h2 className="font-bold text-slate-900">
                Assessment Details
              </h2>
            </div>

          </div>

          <div className="grid gap-5 md:grid-cols-3">

            <Field
              label="Exam / Framework"
              required
            >
              <select
                value={exam}
                onChange={(e) =>
                  setExam(e.target.value)
                }
                className="input"
              >
                {EXAMS.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  )
                )}
              </select>
            </Field>

            <Field
              label="Class"
              required
            >
              <select
                value={className}
                onChange={(e) =>
                  setClassName(
                    e.target.value
                  )
                }
                className="input"
              >
                {CLASSES.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  )
                )}
              </select>
            </Field>

            <Field
              label="Test Title"
              required
            >
              <input
                value={testTitle}
                onChange={(e) =>
                  setTestTitle(
                    e.target.value
                  )
                }
                placeholder="Example: Biology Unit Test"
                className="input"
              />
            </Field>

          </div>

        </section>

        {/* STEP 2 */}

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <BookOpen className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                Step 2
              </p>

              <h2 className="font-bold text-slate-900">
                Academic Scope
              </h2>

              <p className="text-sm text-slate-500">
                Select subjects, chapters and topics from Repository.
              </p>
            </div>

          </div>

          {/* SUBJECTS */}

          {loadingSubjects ? (
            <div className="flex items-center gap-2 py-6 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading subjects...
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
                        toggleSubject(
                          subject
                        )
                      }
                      className={`rounded-xl border p-4 text-left transition ${
                        selected
                          ? "border-blue-400 bg-blue-50 ring-2 ring-blue-100"
                          : "border-slate-200 hover:border-blue-200 hover:bg-slate-50"
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

                        <span className="font-semibold text-slate-800">
                          {subject.name}
                        </span>

                      </div>

                    </button>
                  );
                }
              )}

            </div>
          )}

          {/* SELECTED SUBJECT HIERARCHY */}

          {selectedSubjects.length >
            0 && (
            <div className="mt-6 space-y-4">

              {selectedSubjects.map(
                (subject) => {
                  const chapters =
                    chaptersBySubject[
                      subject.subjectId
                    ] || [];

                  const expanded =
                    expandedSubjects.includes(
                      subject.subjectId
                    );

                  return (
                    <div
                      key={
                        subject.subjectId
                      }
                      className="overflow-hidden rounded-xl border border-slate-200"
                    >

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

                          <p className="font-bold text-slate-900">
                            {subject.subjectName}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {
                              subject.chapters.length
                            }{" "}
                            chapter(s) selected
                          </p>

                        </div>

                        <ChevronDown
                          className={`h-5 w-5 transition ${
                            expanded
                              ? "rotate-180"
                              : ""
                          }`}
                        />

                      </button>

                      {expanded && (
                        <div className="p-4">

                          {loadingChapters ===
                          subject.subjectId ? (
                            <div className="flex items-center gap-2 py-4 text-sm text-slate-500">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Loading chapters...
                            </div>
                          ) : (
                            <div className="space-y-3">

                              {chapters.map(
                                (chapter) => {
                                  const selectedChapter =
                                    subject.chapters.find(
                                      (item) =>
                                        item.chapterId ===
                                        chapter.id
                                    );

                                  const selected =
                                    !!selectedChapter;

                                  const expandedChapter =
                                    expandedChapters.includes(
                                      chapter.id
                                    );

                                  const topics =
                                    topicsByChapter[
                                      chapter.id
                                    ] || [];

                                  return (
                                    <div
                                      key={
                                        chapter.id
                                      }
                                      className={`rounded-xl border ${
                                        selected
                                          ? "border-indigo-200 bg-indigo-50/30"
                                          : "border-slate-200"
                                      }`}
                                    >

                                      {/* CHAPTER */}

                                      <div className="flex items-center gap-3 p-3">

                                        <input
                                          type="checkbox"
                                          checked={
                                            selected
                                          }
                                          onChange={() =>
                                            toggleChapter(
                                              subject.subjectId,
                                              chapter
                                            )
                                          }
                                          className="h-4 w-4"
                                        />

                                        <button
                                          type="button"
                                          disabled={
                                            !selected
                                          }
                                          onClick={async () => {
                                            await loadTopics(
                                              chapter.id
                                            );

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
                                            );
                                          }}
                                          className="flex flex-1 items-center justify-between text-left disabled:cursor-not-allowed"
                                        >

                                          <div>

                                            <p className="text-sm font-semibold text-slate-800">
                                              {
                                                chapter.name
                                              }
                                            </p>

                                            {selected && (
                                              <p className="mt-1 text-xs text-indigo-600">
                                                {selectedChapter?.topics.length ||
                                                  0}{" "}
                                                topic(s) selected
                                              </p>
                                            )}

                                          </div>

                                          <ChevronDown
                                            className={`h-4 w-4 ${
                                              expandedChapter
                                                ? "rotate-180"
                                                : ""
                                            }`}
                                          />

                                        </button>

                                      </div>

                                      {/* TOPICS */}

                                      {selected &&
                                        expandedChapter && (
                                          <div className="border-t border-slate-200 p-4">

                                            {loadingTopics ===
                                            chapter.id ? (
                                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Loading topics...
                                              </div>
                                            ) : topics.length ===
                                              0 ? (
                                              <p className="text-xs text-slate-500">
                                                No topics found for this chapter.
                                              </p>
                                            ) : (
                                              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">

                                                {topics.map(
                                                  (
                                                    topic
                                                  ) => {
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
                                                        className={`flex cursor-pointer items-start gap-2 rounded-lg border p-3 ${
                                                          checked
                                                            ? "border-indigo-300 bg-indigo-50"
                                                            : "border-slate-200 bg-white"
                                                        }`}
                                                      >

                                                        <input
                                                          type="checkbox"
                                                          checked={
                                                            checked
                                                          }
                                                          onChange={() =>
                                                            toggleTopic(
                                                              subject.subjectId,
                                                              chapter.id,
                                                              topic
                                                            )
                                                          }
                                                          className="mt-0.5 h-4 w-4"
                                                        />

                                                        <span className="text-sm text-slate-700">
                                                          {
                                                            topic.name
                                                          }
                                                        </span>

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
                      )}

                    </div>
                  );
                }
              )}

            </div>
          )}

        </section>

        {/* STEP 3 */}

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <Target className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-purple-600">
                Step 3
              </p>

              <h2 className="font-bold text-slate-900">
                AI Question Instructions
              </h2>

              <p className="text-sm text-slate-500">
                Tell LEAP AI exactly what type of assessment to create.
              </p>
            </div>

          </div>

          {/* QUESTION TYPES */}

          <div className="mb-6">

            <label className="mb-3 block text-sm font-semibold text-slate-700">
              Question Type
            </label>

            <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-4">

              {QUESTION_TYPES.map(
                (type) => {
                  const checked =
                    questionTypes.includes(
                      type
                    );

                  return (
                    <label
                      key={type}
                      className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm ${
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
                        className="h-4 w-4"
                      />

                      {type}

                    </label>
                  );
                }
              )}

            </div>

          </div>

          <div className="grid gap-5 md:grid-cols-4">

            <Field
              label="Difficulty"
              required
            >
              <select
                value={difficulty}
                onChange={(e) =>
                  setDifficulty(
                    e.target.value
                  )
                }
                className="input"
              >
                {DIFFICULTIES.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  )
                )}
              </select>
            </Field>

            <Field
              label="Bloom Level"
              required
            >
              <select
                value={bloom}
                onChange={(e) =>
                  setBloom(
                    e.target.value
                  )
                }
                className="input"
              >
                {BLOOM_LEVELS.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  )
                )}
              </select>
            </Field>

            <Field
              label="Number of Questions"
              required
            >
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

            <Field
              label="Duration (minutes)"
              required
            >
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

          {/* EXTRA INSTRUCTIONS */}

          <div className="mt-6">

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Additional AI Instructions
            </label>

            <textarea
              value={
                additionalInstructions
              }
              onChange={(e) =>
                setAdditionalInstructions(
                  e.target.value
                )
              }
              rows={5}
              placeholder="Example: Create competency-based questions, avoid direct memory questions, include application-based questions, follow the latest exam pattern..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />

          </div>

        </section>

        {/* SUMMARY */}

        <section className="mb-6 rounded-2xl border border-indigo-200 bg-indigo-50 p-5">

          <div className="grid gap-4 md:grid-cols-5">

            <Summary
              label="Exam"
              value={exam}
            />

            <Summary
              label="Subjects"
              value={String(
                selectedSubjects.length
              )}
            />

            <Summary
              label="Chapters"
              value={String(
                selectedChapterCount
              )}
            />

            <Summary
              label="Topics"
              value={String(
                selectedTopicCount
              )}
            />

            <Summary
              label="Duration"
              value={`${durationMinutes} min`}
            />

          </div>

        </section>

        {/* ACTIONS */}

        <div className="flex items-center justify-between">

          <button
            type="button"
            onClick={() =>
              router.push(
                "/teacher/dashboard"
              )
            }
            className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={
              handleContinue
            }
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-7 py-3 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >

            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Preparing...
              </>
            ) : (
              <>
                Generate Questions with AI
                <Sparkles className="h-4 w-4" />
                <ArrowRight className="h-4 w-4" />
              </>
            )}

          </button>

        </div>

      </div>

    </main>
  );
}

/* ============================================================
   FIELD
============================================================ */

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      {children}
    </div>
  );
}

/* ============================================================
   SUMMARY
============================================================ */

function Summary({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-white p-4">

      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-lg font-bold text-slate-800">
        {value}
      </p>

    </div>
  );
}