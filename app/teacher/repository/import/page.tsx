"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  FileImage,
  FileText,
  Loader2,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";

import { useRouter } from "next/navigation";

interface Topic {
  name: string;
}

interface Chapter {
  name: string;
  topics: Topic[];
}

interface Subject {
  name: string;
  chapters: Chapter[];
}

interface ExtractionResult {
  sourceTitle: string;
  exam: string;
  className: string;
  subjects: Subject[];
}

export default function RepositoryImportPage() {
  const router =
    useRouter();

  const [file, setFile] =
    useState<File | null>(
      null
    );

  const [result, setResult] =
    useState<ExtractionResult | null>(
      null
    );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [expandedSubjects, setExpandedSubjects] =
    useState<number[]>(
      []
    );

  const [expandedChapters, setExpandedChapters] =
    useState<string[]>(
      []
    );

  const isImage =
    file?.type.startsWith(
      "image/"
    );

  const fileLabel =
    isImage
      ? "Image"
      : "PDF";

  const chapterCount =
    useMemo(() => {
      return (
        result?.subjects.reduce(
          (
            total,
            subject
          ) =>
            total +
            subject.chapters.length,
          0
        ) || 0
      );
    }, [result]);

  const topicCount =
    useMemo(() => {
      return (
        result?.subjects.reduce(
          (
            total,
            subject
          ) =>
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
        ) || 0
      );
    }, [result]);

  function toggleSubject(
    index: number
  ) {
    setExpandedSubjects(
      (current) =>
        current.includes(index)
          ? current.filter(
              (item) =>
                item !== index
            )
          : [
              ...current,
              index,
            ]
    );
  }

  function toggleChapter(
    key: string
  ) {
    setExpandedChapters(
      (current) =>
        current.includes(key)
          ? current.filter(
              (item) =>
                item !== key
            )
          : [
              ...current,
              key,
            ]
    );
  }

  async function extractWithAI() {
    if (!file) {
      setError(
        "Please select a PDF or image."
      );

      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    setResult(null);

    try {
      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      const response =
        await fetch(
          "/api/repository/extract",
          {
            method: "POST",
            body: formData,
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Academic extraction failed."
        );
      }

      setResult(
        data.result
      );

      setExpandedSubjects(
        data.result.subjects.map(
          (
            _: Subject,
            index: number
          ) => index
        )
      );

      setSuccess(
        "AI extraction completed. Review the academic hierarchy before saving."
      );
    } catch (error) {
      console.error(
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Academic extraction failed."
      );
    } finally {
      setLoading(false);
    }
  }

  function updateSubject(
    subjectIndex: number,
    value: string
  ) {
    if (!result) return;

    const subjects =
      [...result.subjects];

    subjects[
      subjectIndex
    ] = {
      ...subjects[
        subjectIndex
      ],
      name: value,
    };

    setResult({
      ...result,
      subjects,
    });
  }

  function updateChapter(
    subjectIndex: number,
    chapterIndex: number,
    value: string
  ) {
    if (!result) return;

    const subjects =
      [...result.subjects];

    const chapters =
      [
        ...subjects[
          subjectIndex
        ].chapters,
      ];

    chapters[
      chapterIndex
    ] = {
      ...chapters[
        chapterIndex
      ],
      name: value,
    };

    subjects[
      subjectIndex
    ] = {
      ...subjects[
        subjectIndex
      ],
      chapters,
    };

    setResult({
      ...result,
      subjects,
    });
  }

  function updateTopic(
    subjectIndex: number,
    chapterIndex: number,
    topicIndex: number,
    value: string
  ) {
    if (!result) return;

    const subjects =
      [...result.subjects];

    const chapters =
      [
        ...subjects[
          subjectIndex
        ].chapters,
      ];

    const topics =
      [
        ...chapters[
          chapterIndex
        ].topics,
      ];

    topics[
      topicIndex
    ] = {
      name: value,
    };

    chapters[
      chapterIndex
    ] = {
      ...chapters[
        chapterIndex
      ],
      topics,
    };

    subjects[
      subjectIndex
    ] = {
      ...subjects[
        subjectIndex
      ],
      chapters,
    };

    setResult({
      ...result,
      subjects,
    });
  }

  function deleteTopic(
    subjectIndex: number,
    chapterIndex: number,
    topicIndex: number
  ) {
    if (!result) return;

    const subjects =
      [...result.subjects];

    const chapters =
      [
        ...subjects[
          subjectIndex
        ].chapters,
      ];

    chapters[
      chapterIndex
    ] = {
      ...chapters[
        chapterIndex
      ],
      topics:
        chapters[
          chapterIndex
        ].topics.filter(
          (
            _,
            index
          ) =>
            index !==
            topicIndex
        ),
    };

    subjects[
      subjectIndex
    ] = {
      ...subjects[
        subjectIndex
      ],
      chapters,
    };

    setResult({
      ...result,
      subjects,
    });
  }

  return (
    <main className="min-h-screen bg-slate-50">

      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <button
            onClick={() =>
              router.push(
                "/teacher/repository"
              )
            }
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft size={18} />
            Repository
          </button>

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <Sparkles size={21} />
            </div>

            <div>
              <h1 className="font-bold text-slate-900">
                AI Academic Import
              </h1>

              <p className="text-xs text-slate-500">
                PDF + Image → Academic Hierarchy
              </p>
            </div>

          </div>

        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-6 px-6 py-8">

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        <section className="rounded-2xl border bg-white p-8 shadow-sm">

          <div className="mb-7">

            <div className="flex items-center gap-3">
              <Upload
                className="text-indigo-600"
                size={25}
              />

              <h2 className="text-2xl font-bold">
                Upload Academic Source
              </h2>
            </div>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Upload a textbook, syllabus,
              scanned document, chapter list,
              or photographed academic material.
              LEAP AI will identify the academic
              hierarchy automatically.
            </p>

          </div>

          <label className="flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-indigo-300 bg-indigo-50/40 px-8 text-center transition hover:bg-indigo-50">

            {file ? (
              isImage ? (
                <FileImage
                  size={42}
                  className="text-indigo-600"
                />
              ) : (
                <FileText
                  size={42}
                  className="text-red-500"
                />
              )
            ) : (
              <Upload
                size={42}
                className="text-indigo-600"
              />
            )}

            <p className="mt-4 font-bold text-slate-800">
              {file
                ? file.name
                : "Choose PDF or Image"}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              PDF • JPG • PNG • WEBP
              <br />
              Maximum 20 MB
            </p>

            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(event) => {
                const selected =
                  event.target.files?.[0] ||
                  null;

                setFile(
                  selected
                );

                setResult(null);
                setError("");
                setSuccess("");
              }}
            />

          </label>

          {file && (
            <div className="mt-5 flex flex-col gap-4 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-3">

                {isImage ? (
                  <FileImage
                    className="text-indigo-600"
                    size={21}
                  />
                ) : (
                  <FileText
                    className="text-red-500"
                    size={21}
                  />
                )}

                <div>
                  <p className="text-sm font-bold">
                    {file.name}
                  </p>

                  <p className="text-xs text-slate-500">
                    {fileLabel} •{" "}
                    {(
                      file.size /
                      1024 /
                      1024
                    ).toFixed(2)}{" "}
                    MB
                  </p>
                </div>

              </div>

              <button
                onClick={
                  extractWithAI
                }
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    AI Analysing...
                  </>
                ) : (
                  <>
                    <Sparkles size={17} />
                    Extract with AI
                  </>
                )}
              </button>

            </div>
          )}

        </section>

        {result && (
          <section className="space-y-5">

            <div className="rounded-2xl border bg-white p-6 shadow-sm">

              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                <div>

                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Proposed Repository Structure
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    {result.sourceTitle}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    AI extracted the hierarchy.
                    Review it before saving.
                  </p>

                </div>

                <div className="grid grid-cols-3 gap-2">

                  <Stat
                    value={
                      result.subjects.length
                    }
                    label="Subjects"
                  />

                  <Stat
                    value={
                      chapterCount
                    }
                    label="Chapters"
                  />

                  <Stat
                    value={
                      topicCount
                    }
                    label="Topics"
                  />

                </div>

              </div>

              {(result.exam ||
                result.className) && (
                <div className="mt-5 flex gap-2">

                  {result.exam && (
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                      {result.exam}
                    </span>
                  )}

                  {result.className && (
                    <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">
                      Class{" "}
                      {result.className}
                    </span>
                  )}

                </div>
              )}

            </div>

            {result.subjects.map(
              (
                subject,
                subjectIndex
              ) => {

                const open =
                  expandedSubjects.includes(
                    subjectIndex
                  );

                return (
                  <div
                    key={
                      subjectIndex
                    }
                    className="overflow-hidden rounded-2xl border bg-white shadow-sm"
                  >

                    <div className="flex items-center gap-3 bg-blue-50 p-5">

                      <button
                        onClick={() =>
                          toggleSubject(
                            subjectIndex
                          )
                        }
                        className="rounded-lg p-1 hover:bg-white"
                      >
                        {open ? (
                          <ChevronDown
                            size={18}
                          />
                        ) : (
                          <ChevronRight
                            size={18}
                          />
                        )}
                      </button>

                      <BookOpen
                        size={20}
                        className="text-blue-600"
                      />

                      <input
                        value={
                          subject.name
                        }
                        onChange={(event) =>
                          updateSubject(
                            subjectIndex,
                            event.target.value
                          )
                        }
                        className="flex-1 rounded-lg border border-transparent bg-transparent px-2 py-1 font-bold outline-none focus:border-blue-300 focus:bg-white"
                      />

                      <span className="text-xs text-slate-500">
                        {
                          subject.chapters.length
                        }{" "}
                        chapters
                      </span>

                    </div>

                    {open && (
                      <div className="space-y-3 p-5">

                        {subject.chapters.map(
                          (
                            chapter,
                            chapterIndex
                          ) => {

                            const key =
                              `${subjectIndex}-${chapterIndex}`;

                            const chapterOpen =
                              expandedChapters.includes(
                                key
                              );

                            return (
                              <div
                                key={
                                  key
                                }
                                className="rounded-xl border"
                              >

                                <div className="flex items-center gap-3 p-4">

                                  <button
                                    onClick={() =>
                                      toggleChapter(
                                        key
                                      )
                                    }
                                    className="rounded-lg p-1 hover:bg-slate-100"
                                  >
                                    {chapterOpen ? (
                                      <ChevronDown
                                        size={17}
                                      />
                                    ) : (
                                      <ChevronRight
                                        size={17}
                                      />
                                    )}
                                  </button>

                                  <input
                                    value={
                                      chapter.name
                                    }
                                    onChange={(
                                      event
                                    ) =>
                                      updateChapter(
                                        subjectIndex,
                                        chapterIndex,
                                        event.target.value
                                      )
                                    }
                                    className="flex-1 rounded-lg border border-transparent px-2 py-1 text-sm font-semibold outline-none focus:border-blue-300"
                                  />

                                  <span className="text-xs text-slate-400">
                                    {
                                      chapter.topics.length
                                    }{" "}
                                    topics
                                  </span>

                                </div>

                                {chapterOpen && (
                                  <div className="space-y-2 border-t bg-slate-50 p-4">

                                    {chapter.topics.map(
                                      (
                                        topic,
                                        topicIndex
                                      ) => (
                                        <div
                                          key={
                                            topicIndex
                                          }
                                          className="flex items-center gap-3 rounded-lg bg-white p-3"
                                        >

                                          <Check
                                            size={15}
                                            className="text-green-600"
                                          />

                                          <input
                                            value={
                                              topic.name
                                            }
                                            onChange={(
                                              event
                                            ) =>
                                              updateTopic(
                                                subjectIndex,
                                                chapterIndex,
                                                topicIndex,
                                                event.target.value
                                              )
                                            }
                                            className="flex-1 border-b border-transparent px-1 py-1 text-sm outline-none focus:border-blue-300"
                                          />

                                          <button
                                            onClick={() =>
                                              deleteTopic(
                                                subjectIndex,
                                                chapterIndex,
                                                topicIndex
                                              )
                                            }
                                            className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                                          >
                                            <Trash2
                                              size={15}
                                            />
                                          </button>

                                        </div>
                                      )
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

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">

              <div className="flex items-start gap-3">

                <Check
                  className="mt-0.5 text-amber-700"
                  size={20}
                />

                <div>
                  <h3 className="font-bold text-amber-900">
                    Teacher Review
                  </h3>

                  <p className="mt-1 text-sm text-amber-800">
                    AI has proposed the academic
                    hierarchy. The teacher reviews
                    and corrects it before it becomes
                    part of the LEAP Repository.
                  </p>
                </div>

              </div>

              <button
                disabled
                className="mt-5 rounded-xl bg-slate-300 px-7 py-3 text-sm font-bold text-white"
              >
                Save Approved Hierarchy
              </button>

            </div>

          </section>
        )}

      </div>
    </main>
  );
}

function Stat({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="min-w-20 rounded-xl bg-slate-100 px-4 py-3 text-center">
      <p className="text-lg font-bold text-slate-900">
        {value}
      </p>

      <p className="text-[11px] font-medium text-slate-500">
        {label}
      </p>
    </div>
  );
}