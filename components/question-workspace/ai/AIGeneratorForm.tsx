"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import GeneratedQuestions from "./GeneratedQuestions";

import type {
  PromptRequest,
  Difficulty,
  ExamPattern,
} from "@/lib/ai/types";

import type { CreateTestForm } from "@/types/test";

interface AIQuestion {
  question: string;

  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };

  correct_answer: string;

  explanation?: string;

  hint?: string;

  difficulty?: string;

  bloom_level?: string;

  learning_objective?: string;

  tags?: string[];
}

interface AIGeneratorFormProps {
  form: CreateTestForm;

  onAddToTest?: (
    questions: AIQuestion[]
  ) => void;
}

export default function AIGeneratorForm({
  form,
  onAddToTest,
}: AIGeneratorFormProps) {
  const [loading, setLoading] =
    useState(false);

  const [questions, setQuestions] =
    useState<AIQuestion[]>([]);

  async function handleGenerate() {
    // ========================================================
    // VALIDATION
    // ========================================================

    if (
      form.subjectNames.length === 0 ||
      form.chapterNames.length === 0 ||
      form.topicNames.length === 0
    ) {
      alert(
        "Please ensure subjects, chapters, and topics are selected."
      );

      return;
    }

    setQuestions([]);

    setLoading(true);

    // ========================================================
    // AI REQUEST
    // ========================================================

    const request: PromptRequest = {
      exam:
        form.examType as ExamPattern,

      className:
        form.classLevel,

      subject:
        form.subjectNames.join(", "),

      chapter:
        form.chapterNames.join(", "),

      topic:
        form.topicNames.join(", "),

      questionType:
        form.questionType,

      difficulty:
        form.difficulty as Difficulty,

      bloom:
        "Auto",

      numberOfQuestions:
        form.totalQuestions,

      language:
        form.language,

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
    };

    try {
      // ======================================================
      // CALL AI API
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

      if (!response.ok) {
        throw new Error(
          data.error ??
            "Failed to generate questions."
        );
      }

      // ======================================================
      // VALID QUESTIONS
      // ======================================================

      const validQuestions =
        data.valid ?? [];

      console.log(
        "========== GENERATED =========="
      );

      console.log(
        validQuestions.length
      );

      console.log(
        validQuestions
      );

      console.log(
        "==============================="
      );

      setQuestions(
        validQuestions
      );

      // ======================================================
      // NO QUESTIONS
      // ======================================================

      if (
        validQuestions.length === 0
      ) {
        alert(
          "AI could not generate valid questions. Please try again."
        );

        return;
      }

      // ======================================================
      // SEND QUESTIONS TO PARENT
      // ======================================================

      onAddToTest?.(
        validQuestions
      );

    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to generate questions."
      );

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* ====================================================
          AI GENERATOR
      ==================================================== */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            AI Question Generator
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Review the assessment configuration
            before generating AI questions.
          </p>
        </div>

        {/* ==================================================
            CONFIGURATION SUMMARY
        ================================================== */}

        <div className="grid grid-cols-2 gap-6 rounded-lg border bg-slate-50 p-6">
          {/* EXAM */}

          <div>
            <p className="text-sm text-slate-500">
              Exam
            </p>

            <p className="font-semibold">
              {form.examType}
            </p>
          </div>

          {/* QUESTION TYPE */}

          <div>
            <p className="text-sm text-slate-500">
              Question Type
            </p>

            <p className="font-semibold">
              {form.questionType}
            </p>
          </div>

          {/* DIFFICULTY */}

          <div>
            <p className="text-sm text-slate-500">
              Difficulty
            </p>

            <p className="font-semibold">
              {form.difficulty}
            </p>
          </div>

          {/* QUESTIONS */}

          <div>
            <p className="text-sm text-slate-500">
              Questions
            </p>

            <p className="font-semibold">
              {form.totalQuestions}
            </p>
          </div>

          {/* SUBJECTS */}

          <div className="col-span-2">
            <p className="text-sm text-slate-500">
              Subjects
            </p>

            <p className="font-semibold">
              {form.subjectNames.length >
              0
                ? form.subjectNames.join(
                    ", "
                  )
                : "Not Selected"}
            </p>
          </div>

          {/* CHAPTERS */}

          <div className="col-span-2">
            <p className="text-sm text-slate-500">
              Chapters
            </p>

            <p className="font-semibold">
              {form.chapterNames.length >
              0
                ? form.chapterNames.join(
                    ", "
                  )
                : "Not Selected"}
            </p>
          </div>

          {/* TOPICS */}

          <div className="col-span-2">
            <p className="text-sm text-slate-500">
              Topics
            </p>

            <p className="font-semibold">
              {form.topicNames.length >
              0
                ? form.topicNames.join(
                    ", "
                  )
                : "Not Selected"}
            </p>
          </div>
        </div>

        {/* ==================================================
            GENERATE BUTTON
        ================================================== */}

        <div className="flex justify-end pt-4">
          <Button
            onClick={handleGenerate}
            disabled={
              loading ||
              form.subjectNames.length ===
                0 ||
              form.chapterNames.length ===
                0 ||
              form.topicNames.length ===
                0
            }
          >
            {loading ? (
              <>
                <span className="mr-2 animate-spin">
                  ⏳
                </span>

                Generating AI Questions...
              </>
            ) : (
              "✨ Generate Questions"
            )}
          </Button>
        </div>
      </div>

      {/* ====================================================
          GENERATED QUESTIONS
      ==================================================== */}

      <GeneratedQuestions
        questions={questions}
        mode="assessment"
        onAddToTest={onAddToTest}
      />

      {/* ====================================================
          SUCCESS MESSAGE
      ==================================================== */}

      {questions.length > 0 && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="font-medium text-green-700">
            ✅ {questions.length} AI
            questions generated
            successfully.
          </p>
        </div>
      )}
    </div>
  );
}