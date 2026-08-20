"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { saveGeneratedAssessment } from "@/services/assessment/save-assessment.service";
import {
  ArrowLeft,
  AlertCircle,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Edit3,
  FileText,
  Loader2,
  Sparkles,
  Target,
  Trash2,
} from "lucide-react";

import {
  getSubjects,
  getChapters,
  getTopics,
} from "@/services/repository.service";

// ============================================================
// TYPES
// ============================================================

interface SelectedTopic {
  topicId: number;
  topicName: string;
}

interface SelectedChapter {
  chapterId: number;
  chapterName: string;
  topics: SelectedTopic[];
}

interface SubjectSelection {
  subjectId: number;
  subjectName: string;
  chapters: SelectedChapter[];
}

interface TestConfiguration {
  exam: string;
  className: string;
  testTitle: string;
  subjects: SubjectSelection[];
  questionTypes: string[];
  difficulty: string;
  totalQuestions: number;
  numberOfQuestions: number;
  durationMinutes: number;
  duration?: number;
  additionalInstructions?: string;
  hierarchyMode?: string;
  chapterOptional?: boolean;
  topicOptional?: boolean;
}

interface GenerationJob {
  subject: SubjectSelection;
  chapterText: string;
  topicText: string;
  numberOfQuestions: number;
}

interface GeneratedQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  hint: string;
  learningObjective: string;
  tags: string[];
  difficulty: string;
  marks: number;
  negativeMarks: number;
  questionType: string;
  status: string;
  subjectName: string;
  chapterName: string;
  topicName: string;
  review?: {
    status:
      | "Approved"
      | "Flagged"
      | "Modified";
    notes?: string;
  };
}


// ============================================================
// BUILD AI GENERATION JOBS
// ============================================================

function buildGenerationJobs(
  config: TestConfiguration
): GenerationJob[] {

  const validSubjects =
    config.subjects.filter(
      (subject) =>
        subject.subjectName?.trim()
    );

  if (!validSubjects.length) {
    return [];
  }

  const totalQuestions =
    Number(
      config.totalQuestions ??
        config.numberOfQuestions ??
        0
    );

  if (totalQuestions < 1) {
    return [];
  }

  const totalSubjects =
    validSubjects.length;

  const basePerSubject =
    Math.floor(
      totalQuestions /
        totalSubjects
    );

  let remainder =
    totalQuestions %
    totalSubjects;

  const jobs: GenerationJob[] = [];

  validSubjects.forEach(
    (subject) => {

      let count =
        basePerSubject;

      if (remainder > 0) {
        count += 1;
        remainder -= 1;
      }

      const chapterNames =
        subject.chapters
          ?.map(
            (chapter) =>
              chapter.chapterName
          )
          .filter(Boolean) || [];

      const topicNames =
        subject.chapters
          ?.flatMap(
            (chapter) =>
              chapter.topics || []
          )
          .map(
            (topic) =>
              topic.topicName
          )
          .filter(Boolean) || [];

      jobs.push({
        subject,

        chapterText:
          chapterNames.join(", "),

        topicText:
          topicNames.join(", "),

        numberOfQuestions:
          count,
      });
    }
  );

  return jobs;
}
// ============================================================
// COMPONENT
// ============================================================

export default function QuestionsPage() {

  // ==========================================================
  // STATE
  // ==========================================================

  const [
    configuration,
    setConfiguration,
  ] =
    useState<TestConfiguration | null>(
      null
    );

  const [
    questions,
    setQuestions,
  ] =
    useState<GeneratedQuestion[]>(
      []
    );

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    success,
    setSuccess,
  ] =
    useState("");

  const [
    editingIndex,
    setEditingIndex,
  ] =
    useState<number | null>(
      null
    );

  const [
    editForm,
    setEditForm,
  ] =
    useState<GeneratedQuestion | null>(
      null
    );
// ==========================================================
  // LOAD CONFIGURATION
  // ==========================================================

  useEffect(() => {
    // ==========================================================
    // LOAD TEST CONFIGURATION
    // ==========================================================

    const rawConfig =
      sessionStorage.getItem(
        "leap_test_configuration"
      ) ||
      sessionStorage.getItem(
        "leap_assessment_config"
      );

    // ==========================================================
    // NO CONFIGURATION
    // ==========================================================

    if (!rawConfig) {
      console.warn(
        "No assessment configuration found."
      );

      window.location.href =
        "/teacher/assessment/create";

      return;
    }

    // ==========================================================
    // PARSE CONFIGURATION
    // ==========================================================

    try {
      const parsed =
        JSON.parse(
          rawConfig
        ) as TestConfiguration;

      console.log(
        "========== TEST CONFIGURATION LOADED =========="
      );

      console.log(
        JSON.stringify(
          parsed,
          null,
          2
        )
      );

      console.log(
        "SUBJECTS:",
        parsed.subjects
      );

      console.log(
        "==============================================="
      );

      // Store configuration in React state
      setConfiguration(parsed);

    } catch (err) {
      console.error(
        "Invalid assessment configuration:",
        err
      );

      sessionStorage.removeItem(
        "leap_test_configuration"
      );

      sessionStorage.removeItem(
        "leap_assessment_config"
      );

      window.location.href =
        "/teacher/assessment/create";

      return;
    }

    // ==========================================================
    // LOAD EXISTING QUESTIONS
    // ==========================================================
    //
    // This allows the teacher to refresh the Questions page
    // without losing questions already generated in the
    // CURRENT assessment.
    //
    // OLD questions are cleared when a NEW assessment is
    // started from the Create Test page.
    // ==========================================================

    const cachedQuestions =
      sessionStorage.getItem(
        "leap_generated_questions"
      );

    if (cachedQuestions) {
      try {
        const parsedQuestions =
          JSON.parse(
            cachedQuestions
          ) as GeneratedQuestion[];

        if (
          Array.isArray(
            parsedQuestions
          )
        ) {
          setQuestions(
            parsedQuestions
          );

          console.log(
            "========== CACHED QUESTIONS RESTORED =========="
          );

          console.log(
            `Restored ${parsedQuestions.length} questions.`
          );

          console.log(
            "================================================"
          );
        }

      } catch (err) {
        console.error(
          "Invalid cached questions:",
          err
        );

        sessionStorage.removeItem(
          "leap_generated_questions"
        );
      }
    }

  }, []);
    // ==========================================================
  // GENERATE QUESTIONS
  // ==========================================================

  async function handleGenerate() {
    if (!configuration) {
      return;
    }

    setError("");

    setSuccess("");

    setQuestions([]);

    setLoading(true);

    try {
      /*
       * Build jobs from SUBJECTS.
       *
       * Chapter / Topic are optional.
       */

      const jobs =
        buildGenerationJobs(
          configuration
        );

      console.log(
        "========== SUBJECT VALIDATION =========="
      );

      configuration.subjects.forEach(
        (subject) => {
          console.log({
            subjectId: subject.subjectId,
            subjectName: subject.subjectName,
            chapters: subject.chapters,
          });
        }
      );

      console.log(
        "========================================"
      );

      const invalidSubjects =
        configuration.subjects.filter(
          (subject) =>
            !subject.subjectName ||
            !subject.subjectName.trim()
        );

      if (invalidSubjects.length > 0) {
        throw new Error(
          "One or more selected subjects are invalid. Please return to Create Assessment and select a valid subject."
        );
      }

      if (!jobs.length) {
        throw new Error(
          "At least one subject is required for AI question generation."
        );
      }

      console.log(
        "========== GENERATION JOBS =========="
      );

      console.log(
        jobs
      );

      console.log(
        "======================================"
      );

      const generated: GeneratedQuestion[] =
        [];

      // ========================================================
      // GENERATE SUBJECT BY SUBJECT
      // ========================================================

      for (
        const job of jobs
      ) {
        if (
          job.numberOfQuestions <=
          0
        ) {
          continue;
        }

        /*
         * ------------------------------------------------------
         * ACADEMIC SCOPE
         * ------------------------------------------------------
         */

        const hasChapter =
          Boolean(
            job.chapterText.trim()
          );

        const hasTopic =
          Boolean(
            job.topicText.trim()
          );

        let scopeInstruction =
          "";

        if (
          hasChapter &&
          hasTopic
        ) {
          scopeInstruction = `
The teacher selected the following academic scope:

Chapter:
${job.chapterText}

Topic:
${job.topicText}

Generate questions specifically within
this academic scope.
`;
        } else if (
          hasChapter
        ) {
          scopeInstruction = `
The teacher selected the following chapter:

Chapter:
${job.chapterText}

No specific topic was selected.

Generate questions from suitable concepts
and sections within this chapter.
`;
        } else if (
          hasTopic
        ) {
          scopeInstruction = `
No specific chapter was selected.

The teacher specified the following topic:

Topic:
${job.topicText}

Generate questions appropriate to this
topic within the selected subject.
`;
        } else {
          scopeInstruction = `
No chapter or topic was selected.

This is intentional.

Use the selected Exam, Class and Subject
to determine appropriate academic content.

AI may choose suitable chapters,
concepts and topics from the subject.
`;
        }

        /*
         * ------------------------------------------------------
         * AI REQUEST
         * ------------------------------------------------------
         */

        const request = {
          exam:
            configuration.exam,

          className:
            configuration.className,

          subject:
            job.subject.subjectName,

          /*
           * Optional.
           *
           * Empty string means AI can choose.
           */

          chapter:
            job.chapterText,

          topic:
            job.topicText,

          questionType:
            configuration.questionTypes.join(
              ", "
            ),

          difficulty:
            configuration.difficulty,

          bloom:
            "Auto",

          numberOfQuestions:
            job.numberOfQuestions,

          language:
            "English",

          includeExplanation:
            true,

          includeHint:
            true,

          includeLearningObjective:
            true,

          includeTags:
            true,

          avoidDuplicates:
            true,

          additionalInstructions: [
            configuration.additionalInstructions ||
              "",

            `Framework: ${configuration.exam}`,

            `Class: ${configuration.className}`,

            `Subject: ${job.subject.subjectName}`,

            `
IMPORTANT SUBJECT RULE:

The selected subject is exactly:
"${job.subject.subjectName}"

Use this exact subject for the questions.

Do NOT rename, shorten, expand, replace, reinterpret,
or substitute the subject with another subject.

For example, if the selected subject is "Informatics Practices",
do NOT use "Computer", "Computer Science", or any other subject.

Generate questions only from the selected subject.
`,

            `Allowed question types: ${configuration.questionTypes.join(
              ", "
            )}`,

            scopeInstruction,

            `
IMPORTANT LEAP RULE:

Exam + Class + Subject are mandatory.

Chapter and Topic are optional.

Do NOT refuse generation because
Chapter or Topic is not specified.
`,

            `
Questions must be accurate,
unambiguous and appropriate for
the selected examination framework
and class.
`,

            `
Return valid JSON only.
`,
          ]
            .filter(Boolean)
            .join("\n"),
        };

        console.log(
          "========== AI REQUEST =========="
        );

        console.log(
          request
        );

        console.log(
          "================================="
        );

        // ======================================================
        // API CALL
        // ======================================================

        const response =
          await fetch(
            "/api/ai/generate",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify(
                  request
                ),
            }
          );

        const data =
          await response.json();

        console.log(
          "========== AI API RESPONSE =========="
        );

        console.log(
          data
        );

        console.log(
          "======================================"
        );

        if (!response.ok) {
          throw new Error(
            data.error ||
              `AI generation failed for ${job.subject.subjectName}.`
          );
        }

        /*
         * The API may return:
         *
         * data.valid
         *
         * OR
         *
         * data.questions
         */

        const apiQuestions =
          Array.isArray(
            data.valid
          )
            ? data.valid
            : Array.isArray(
                data.questions
              )
            ? data.questions
            : [];

        if (
          apiQuestions.length ===
          0
        ) {
          const invalid =
            Array.isArray(
              data.invalid
            )
              ? data.invalid
              : [];

          console.error(
            "========== AI INVALID QUESTIONS =========="
          );

          console.error(
            invalid
          );

          console.error(
            "==========================================="
          );

          if (
            invalid.length > 0
          ) {
            throw new Error(
              `AI generated questions, but validation rejected them. ${JSON.stringify(
                invalid
              )}`
            );
          }

          throw new Error(
            "AI returned no questions. Check the terminal for the Gemini response."
          );
        }

        // ======================================================
        // NORMALIZE QUESTIONS
        // ======================================================

        apiQuestions.forEach(
          (
            question: Record<
              string,
              unknown
            >,
            index: number
          ) => {
            const rawOptions =
              question.options;

            let options: string[] =
              [];

            if (
              Array.isArray(
                rawOptions
              )
            ) {
              options =
                rawOptions.map(
                  String
                );
            } else if (
              rawOptions &&
              typeof rawOptions ===
                "object"
            ) {
              const optionObject =
                rawOptions as Record<
                  string,
                  unknown
                >;

              options = [
                optionObject.A,
                optionObject.B,
                optionObject.C,
                optionObject.D,
                optionObject.E,
              ]
                .filter(
                  (
                    option
                  ) =>
                    option !==
                      undefined &&
                    option !==
                      null &&
                    String(
                      option
                    ).trim() !==
                      ""
                )
                .map(
                  String
                );
            }

            const correctAnswer =
              String(
                question.correctAnswer ??
                  question.correct_answer ??
                  ""
              );

            const learningObjective =
              String(
                question.learningObjective ??
                  question.learning_objective ??
                  ""
              );

            const difficulty =
              String(
                question.difficulty ??
                  configuration.difficulty
              );

            const questionType =
              String(
                question.questionType ??
                  question.question_type ??
                  configuration
                    .questionTypes[0] ??
                  "MCQ"
              );

            const marks =
              Number(
                question.marks ??
                  4
              );

            const negativeMarks =
              Number(
                question.negativeMarks ??
                  question.negative_marks ??
                  1
              );

            generated.push({
              id: `${job.subject.subjectId}-${Date.now()}-${index}-${Math.random()
                .toString(36)
                .slice(2)}`,

              question:
                String(
                  question.question ??
                    question.question_text ??
                    ""
                ),

              options,

              correctAnswer,

              explanation:
                String(
                  question.explanation ??
                    ""
                ),

              hint:
                String(
                  question.hint ??
                    ""
                ),

              learningObjective,

              tags:
                Array.isArray(
                  question.tags
                )
                  ? question.tags.map(
                      String
                    )
                  : [],

              difficulty,

              marks,

              negativeMarks,

              questionType,

              status:
                "Generated",

              subjectName:
                job.subject
                  .subjectName,

              /*
               * If chapter/topic were not
               * selected, keep these labels
               * meaningful for the teacher.
               */

              chapterName:
                job.chapterText ||
                "AI Selected",

              topicName:
                job.topicText ||
                "AI Selected",

              review:
                undefined,
            });
          }
        );
      }

      // ========================================================
      // FINAL CHECK
      // ========================================================

      if (
        !generated.length
      ) {
        throw new Error(
          "AI did not return any valid questions."
        );
      }

      setQuestions(
        generated
      );

      sessionStorage.setItem(
        "leap_generated_questions",
        JSON.stringify(
          generated
        )
      );

      setSuccess(
        `${generated.length} questions generated successfully. Review and edit them before saving.`
      );
    } catch (err) {
      console.error(
        "Question generation error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate questions."
      );
    } finally {
      setLoading(false);
    }
  }

// ==========================================================
  // ============================================================
  // EXPORT QUESTION PAPER
  // ============================================================

  function exportQuestionPaper() {
    if (!questions.length) {
      setError("No questions are available to export.");
      return;
    }

    const approvedQuestions = questions.filter(
      (question) => question.status === "Approved"
    );

    const questionsToExport =
      approvedQuestions.length > 0
        ? approvedQuestions
        : questions;

    const title =
      configuration?.testTitle ||
      "LEAP Assessment Question Paper";

    const exam =
      configuration?.exam || "";

    const className =
      configuration?.className || "";

    const duration =
      configuration?.durationMinutes ||
      configuration?.duration ||
      "";

    const totalMarks = questionsToExport.reduce(
      (sum, question) =>
        sum + Number(question.marks ?? 0),
      0
    );

    const escapeHtml = (value: unknown) =>
      String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    const optionsHtml = (options: string[]) => {
      if (!options || !options.length) {
        return "";
      }

      return `
        <div class="options">
          ${options
            .map(
              (option, index) => `
                <div class="option">
                  <strong>${String.fromCharCode(65 + index)}.</strong>
                  ${escapeHtml(option)}
                </div>
              `
            )
            .join("")}
        </div>
      `;
    };

    const questionsHtml = questionsToExport
      .map(
        (question, index) => `
          <div class="question">
            <div class="question-text">
              <strong>${index + 1}.</strong>
              ${escapeHtml(question.question)}
            </div>

            ${optionsHtml(question.options || [])}

            <div class="question-meta">
              <span>
                Subject: ${escapeHtml(question.subjectName)}
              </span>

              <span>
                Difficulty: ${escapeHtml(question.difficulty)}
              </span>

              <span>
                Marks: ${Number(question.marks ?? 0)}
              </span>
            </div>
          </div>
        `
      )
      .join("");

    const printWindow = window.open(
      "",
      "_blank",
      "width=900,height=1000"
    );

    if (!printWindow) {
      setError(
        "Unable to open the export window. Please allow pop-ups for this site."
      );
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />

        <title>${escapeHtml(title)}</title>

        <style>
          @page {
            size: A4;
            margin: 18mm;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 0;
            font-family: Arial, Helvetica, sans-serif;
            color: #111827;
            background: white;
            font-size: 12pt;
            line-height: 1.55;
          }

          .paper {
            width: 100%;
          }

          .header {
            text-align: center;
            border-bottom: 2px solid #111827;
            padding-bottom: 12px;
            margin-bottom: 16px;
          }

          .school {
            font-size: 18pt;
            font-weight: 700;
            margin-bottom: 4px;
          }

          .platform {
            font-size: 11pt;
            color: #475569;
            margin-bottom: 8px;
          }

          .title {
            font-size: 16pt;
            font-weight: 700;
            text-transform: uppercase;
            margin-top: 8px;
          }

          .details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 6px 30px;
            margin: 14px 0 20px;
            padding: 10px;
            border: 1px solid #cbd5e1;
            background: #f8fafc;
          }

          .detail {
            font-size: 10.5pt;
          }

          .instructions {
            margin: 15px 0;
          }

          .instructions-title {
            font-weight: 700;
            margin-bottom: 5px;
          }

          .question {
            margin-bottom: 20px;
            page-break-inside: avoid;
          }

          .question-text {
            font-size: 12pt;
            margin-bottom: 8px;
          }

          .options {
            margin-left: 25px;
            margin-top: 6px;
          }

          .option {
            margin: 4px 0;
          }

          .question-meta {
            margin-top: 8px;
            padding-top: 5px;
            border-top: 1px dotted #cbd5e1;
            font-size: 8.5pt;
            color: #64748b;
            display: flex;
            gap: 18px;
          }

          .footer {
            margin-top: 25px;
            padding-top: 10px;
            border-top: 1px solid #cbd5e1;
            text-align: center;
            font-size: 8.5pt;
            color: #64748b;
          }

          @media print {
            .no-print {
              display: none !important;
            }
          }

          .print-button {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 18px;
            background: #2563eb;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
          }

          @media print {
            .print-button {
              display: none;
            }
          }
        </style>
      </head>

      <body>

        <button
          class="print-button"
          onclick="window.print()"
        >
          Print / Save as PDF
        </button>

        <div class="paper">

          <div class="header">
            <div class="school">
              LEAP Assessment AI
            </div>

            <div class="platform">
              AI-Powered Assessment Platform
            </div>

            <div class="title">
              ${escapeHtml(title)}
            </div>
          </div>

          <div class="details">

            <div class="detail">
              <strong>Exam:</strong>
              ${escapeHtml(exam)}
            </div>

            <div class="detail">
              <strong>Class:</strong>
              ${escapeHtml(className)}
            </div>

            <div class="detail">
              <strong>Total Questions:</strong>
              ${questionsToExport.length}
            </div>

            <div class="detail">
              <strong>Total Marks:</strong>
              ${totalMarks}
            </div>

            <div class="detail">
              <strong>Duration:</strong>
              ${
                duration
                  ? `${escapeHtml(duration)} minutes`
                  : "Not specified"
              }
            </div>

            <div class="detail">
              <strong>Questions Exported:</strong>
              ${approvedQuestions.length > 0
                ? "Approved Questions"
                : "All Generated Questions"}
            </div>

          </div>

          <div class="instructions">

            <div class="instructions-title">
              General Instructions:
            </div>

            <ol>
              <li>Read all questions carefully.</li>
              <li>Answer all questions as instructed.</li>
              ${
                configuration?.additionalInstructions
                  ? `<li>${escapeHtml(
                      configuration.additionalInstructions
                    )}</li>`
                  : ""
              }
            </ol>

          </div>

          <div class="questions">
            ${questionsHtml}
          </div>

          <div class="footer">
            Generated using LEAP Assessment AI
          </div>

        </div>

      </body>
      </html>
    `);

    printWindow.document.close();

    printWindow.focus();
  }

  // APPROVE ALL QUESTIONS
// ==========================================================

function handleApproveAll() {
  if (!questions.length) {
    setError(
      "There are no questions to approve."
    );
    return;
  }

  const approved = questions.map(
    (question) => ({
      ...question,

      status: "Approved" as const,

      review: {
        status:
          "Approved" as const,

        notes:
          "Approved by teacher.",
      },
    })
  );

  setQuestions(approved);

  sessionStorage.setItem(
    "leap_generated_questions",
    JSON.stringify(
      approved
    )
  );

  setError("");

  setSuccess(
    `${approved.length} question${
      approved.length === 1
        ? ""
        : "s"
    } approved successfully.`
  );
}
// ==========================================================
// EXPORT AS JSON
// ==========================================================

function handleExportAssessment() {
  if (!configuration || !questions.length) {
    setError("There is no assessment available to export.");
    return;
  }

  const assessment = {
    configuration,
    questions,
    exportedAt: new Date().toISOString(),
  };

  const blob = new Blob(
    [JSON.stringify(assessment, null, 2)],
    {
      type: "application/json",
    }
  );

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download =
    `${configuration.testTitle || "LEAP-Assessment"}`
      .replace(/[^a-z0-9-_]+/gi, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") +
    ".json";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
  // ==========================================================
  // SAVE TEST
  // ==========================================================

  async function handleSaveTest() {
    if (!configuration) {
      setError("Assessment configuration is missing.");
      return;
    }

    if (!questions.length) {
      setError("No questions are available to save.");
      return;
    }

    const expectedQuestions = Number(
      configuration.totalQuestions ??
        configuration.numberOfQuestions ??
        0
    );

    if (
      questions.length !== expectedQuestions
    ) {
      setError(
        `Expected ${expectedQuestions} questions but only ${questions.length} are available.`
      );
      return;
    }

    const unapproved = questions.filter(
      (question) =>
        question.status !== "Approved"
    );

    if (unapproved.length > 0) {
      setError(
        `Please approve all ${unapproved.length} remaining question(s) before saving the test.`
      );
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      console.log(
        "================================================"
      );
      console.log(
        "       FINAL ASSESSMENT SAVE STARTED"
      );
      console.log(
        "================================================"
      );

      const result =
        await saveGeneratedAssessment({
          configuration,
          questions,
        });

      sessionStorage.setItem(
        "leap_saved_test_id",
        String(result.test.id)
      );

      sessionStorage.setItem(
        "leap_final_assessment",
        JSON.stringify({
          configuration,
          questions,
          test: result.test,
          savedAt: new Date().toISOString(),
          status: "Saved",
        })
      );

      sessionStorage.removeItem(
        "leap_generated_questions"
      );

      setSuccess(
        "Assessment saved successfully."
      );

      console.log(
        "Test ID:",
        result.test.id
      );

      console.log(
        "Questions saved:",
        result.questions.length
      );

      console.log(
        "Test-question links:",
        result.testQuestions.length
      );

      /*
       * Stay on this page for now.
       * We will add Test Builder navigation after
       * the database save is verified successfully.
       */
    } catch (err) {
      console.error(
        "================================================"
      );
      console.error(
        "       FINAL ASSESSMENT SAVE ERROR"
      );
      console.error(err);
      console.error(
        "================================================"
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save the assessment."
      );
    } finally {
      setLoading(false);
    }
  }

  // ==========================================================
  // EDIT QUESTION
  // ==========================================================

  function handleStartEdit(
    index: number
  ) {
    setEditingIndex(
      index
    );

    setEditForm({
      ...questions[index],
    });
  }

  // ==========================================================
  // SAVE EDIT
  // ==========================================================

  function handleSaveEdit() {
    if (
      editingIndex === null ||
      !editForm
    ) {
      return;
    }

    const updated = [
      ...questions,
    ];

    updated[
      editingIndex
    ] = editForm;

    setQuestions(
      updated
    );

    sessionStorage.setItem(
      "leap_generated_questions",
      JSON.stringify(
        updated
      )
    );

    setEditingIndex(
      null
    );

    setEditForm(
      null
    );
  }

  // ==========================================================
  // DELETE
  // ==========================================================

  function handleDeleteQuestion(
    index: number
  ) {
    const updated =
      questions.filter(
        (_, i) =>
          i !== index
      );

    setQuestions(
      updated
    );

    sessionStorage.setItem(
      "leap_generated_questions",
      JSON.stringify(
        updated
      )
    );
  }

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">

      {/* ====================================================
          HEADER
      ==================================================== */}

      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-md">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <div className="flex items-center gap-4">

            <a
              href="/teacher/assessment/create"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100"
              title="Back to Create Assessment"
              aria-label="Back to Create Assessment"
            >
              <ArrowLeft className="h-5 w-5" />
            </a>
            <div>

              <h1 className="text-xl font-bold text-slate-900">
                {configuration?.testTitle ||
                  "Assessment Questions Workspace"}
              </h1>

              <p className="text-xs text-slate-500">
                {configuration?.exam}
                {" • "}
                {configuration?.className}
              </p>

            </div>

          </div>

          <button
            onClick={
              handleGenerate
            }
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50"
          >

            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}

            {questions.length > 0
              ? "Regenerate Questions"
              : "Generate Questions"}

          </button>

        </div>

      </header>

      {/* ====================================================
          CONTENT
      ==================================================== */}

      <main className="mx-auto max-w-7xl px-6 pt-8">

        {/* ERROR */}

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800">

            <AlertCircle className="h-5 w-5 flex-shrink-0 text-rose-600" />

            <p className="text-sm font-medium">
              {error}
            </p>

          </div>
        )}

        {/* SUCCESS */}

        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">

            <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-600" />

            <p className="text-sm font-medium">
              {success}
            </p>

          </div>
        )}

        {/* ==================================================
            ACADEMIC SCOPE SUMMARY
        ================================================== */}

        {configuration && (
          <div className="mb-6 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5">

            <div className="flex flex-wrap gap-3">

              <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-indigo-700 shadow-sm">
                {configuration.exam}
              </span>

              <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-indigo-700 shadow-sm">
                {configuration.className}
              </span>

              {configuration.subjects.map(
                (subject) => {

                  const chapters =
                    subject.chapters ||
                    [];

                  const topics =
                    chapters.flatMap(
                      (chapter) =>
                        chapter.topics ||
                        []
                    );

                  return (
                    <span
                      key={
                        subject.subjectId
                      }
                      className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm"
                    >
                      {subject.subjectName}

                      {chapters.length >
                        0 &&
                        ` • ${chapters.length} chapter${
                          chapters.length >
                          1
                            ? "s"
                            : ""
                        }`}

                      {topics.length >
                        0 &&
                        ` • ${topics.length} topic${
                          topics.length >
                          1
                            ? "s"
                            : ""
                        }`}
                    </span>
                  );
                }
              )}

            </div>

            <p className="mt-3 text-xs text-indigo-700">

              {configuration.subjects.some(
                (subject) =>
                  subject.chapters
                    ?.length > 0
              )
                ? "Selected chapters/topics are being used to narrow AI generation."
                : "No chapter or topic selected. AI will choose appropriate content from the selected subject."}

            </p>

          </div>
        )}

        {/* ==================================================
            EMPTY STATE
        ================================================== */}

        {questions.length ===
          0 &&
          !loading && (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">

              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">

                <Sparkles className="h-8 w-8" />

              </div>

              <h3 className="text-lg font-bold text-slate-900">
                No Questions Generated Yet
              </h3>

              <p className="mt-1 max-w-md text-sm text-slate-500">

                AI will generate questions using
                Exam + Class + Subject.

                Chapter and Topic are optional
                precision filters.

              </p>

              <button
                onClick={
                  handleGenerate
                }
                className="mt-6 flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
              >

                <Sparkles className="h-4 w-4" />

                Generate Questions Now

              </button>

            </div>
          )}

        {/* ==================================================
            LOADING
        ================================================== */}

        {loading && (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-sm">

            <Loader2 className="mb-4 h-10 w-10 animate-spin text-indigo-600" />

            <h3 className="text-lg font-bold text-slate-900">
              Generating Questions with AI...
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              AI is analysing the selected academic
              scope and generating questions.
            </p>

          </div>
        )}

        {/* ==================================================
            QUESTIONS
        ================================================== */}

        {questions.length >
          0 &&
          !loading && (
            <div className="space-y-6">

              <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Total Generated Questions:
                    <span className="font-bold text-slate-900">
                      {" "}
                      {questions.length}
                    </span>
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Approved:
                    {" "}
                    {
                      questions.filter(
                        (question) =>
                          question.status === "Approved"
                      ).length
                    }
                    {" / "}
                    {questions.length}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">

                  <button
                    type="button"
                    onClick={exportQuestionPaper}
                    disabled={
                      loading ||
                      questions.length === 0
                    }
                    className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FileText className="h-4 w-4" />
                    Export Question Paper
                  </button>

                  <button
                    type="button"
                    onClick={handleApproveAll}
                    disabled={
                      loading ||
                      questions.length === 0 ||
                      questions.every(
                        (question) =>
                          question.status === "Approved"
                      )
                    }
                    className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Approve All
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveTest}
                    disabled={
                      loading ||
                      questions.length === 0 ||
                      !questions.every(
                        (question) =>
                          question.status === "Approved"
                      )
                    }
                    className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}

                    {loading
                      ? "Saving..."
                      : "Save Test"}
                  </button>

                </div>

              </div>

              <div className="space-y-4">

                {questions.map(
                  (q, idx) => (

                    <div
                      key={
                        q.id ||
                        idx
                      }
                      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300"
                    >

                      {editingIndex ===
                        idx &&
                      editForm ? (

                        <div className="space-y-4">

                          <div>

                            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                              Question Text
                            </label>

                            <textarea
                              value={
                                editForm.question
                              }
                              onChange={(
                                e
                              ) =>
                                setEditForm(
                                  {
                                    ...editForm,
                                    question:
                                      e.target
                                        .value,
                                  }
                                )
                              }
                              rows={3}
                              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                            />

                          </div>

                          <div className="flex justify-end gap-3">

                            <button
                              onClick={() =>
                                setEditingIndex(
                                  null
                                )
                              }
                              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100"
                            >
                              Cancel
                            </button>

                            <button
                              onClick={
                                handleSaveEdit
                              }
                              className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                            >
                              Save Changes
                            </button>

                          </div>

                        </div>

                      ) : (

                        <div>

                          <div className="flex items-start justify-between gap-4">

                            <div className="flex flex-wrap items-center gap-3">

                              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-700">
                                {idx + 1}
                              </span>

                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                                {q.questionType}
                              </span>

                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                                {q.difficulty}
                              </span>

                              <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-medium text-indigo-700">
                                {q.subjectName}
                              </span>

                              {q.chapterName && (
                                <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-500">
                                  {q.chapterName}
                                </span>
                              )}

                              {q.topicName && (
                                <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-500">
                                  {q.topicName}
                                </span>
                              )}

                            </div>

                            <div className="flex items-center gap-2">

                              <button
                                onClick={() =>
                                  handleStartEdit(
                                    idx
                                  )
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                                title="Edit question"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>

                              <button
                                onClick={() =>
                                  handleDeleteQuestion(
                                    idx
                                  )
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-rose-600 hover:bg-rose-50"
                                title="Delete question"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>

                            </div>

                          </div>

                          <p className="mt-4 text-sm font-semibold leading-relaxed text-slate-900">
                            {q.question}
                          </p>

                          {q.options &&
                            q.options
                              .length >
                              0 && (

                              <div className="mt-4 grid gap-2 sm:grid-cols-2">

                                {q.options.map(
                                  (
                                    opt,
                                    optIdx
                                  ) => {

                                    const optionLetter =
                                      String.fromCharCode(
                                        65 +
                                          optIdx
                                      );

                                    const isCorrect =
                                      optionLetter ===
                                        q.correctAnswer ||
                                      opt.startsWith(
                                        q.correctAnswer
                                      );

                                    return (
                                      <div
                                        key={
                                          optIdx
                                        }
                                        className={`flex items-center gap-3 rounded-xl border p-3 text-xs ${
                                          isCorrect
                                            ? "border-emerald-500 bg-emerald-50/50 font-medium text-emerald-900"
                                            : "border-slate-200 bg-slate-50/50 text-slate-700"
                                        }`}
                                      >

                                        <span className="font-bold">
                                          {
                                            optionLetter
                                          }
                                          .
                                        </span>

                                        <span>
                                          {
                                            opt
                                          }
                                        </span>

                                      </div>
                                    );
                                  }
                                )}

                              </div>
                            )}

                          {q.explanation && (
                            <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">

                              <span className="font-semibold text-slate-800">
                                Explanation:
                              </span>{" "}

                              {
                                q.explanation
                              }

                            </div>
                          )}

                        </div>
                      )}

                    </div>
                  )
                )}

              </div>

            </div>
          )}

      </main>

    </div>
  );
}






