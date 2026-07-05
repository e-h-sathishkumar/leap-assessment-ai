"use client";

import { useState } from "react";

import SourceCard from "./SourceCard";
import type { AIQuestion } from "@/components/question-workspace/ai/QuestionCard";
import AIGenerator from "@/components/question-workspace/ai/AIGenerator";

import type { Subject } from "@/types/subject";
import type { Chapter } from "@/types/chapter";
import type { Topic } from "@/types/topic";
interface AIBuilderProps {
  subjects: Subject[];
  chapters: Chapter[];
  topics: Topic[];

  onQuestionsSelected?: (
    questions: AIQuestion[]
  ) => void;
}

type BuilderSource =
  | "home"
  | "repository"
  | "ai"
  | "resource"
  | "hybrid";

export default function AIBuilder({
  subjects,
  chapters,
  topics,
  onQuestionsSelected,
}: AIBuilderProps) {

  const [source, setSource] =
    useState<BuilderSource>("home");

  //--------------------------------------------------
  // AI Generator
  //--------------------------------------------------

  if (source === "ai") {
    return (
     <AIGenerator
  subjects={subjects}
  chapters={chapters}
  topics={topics}
  onAddToTest={onQuestionsSelected}
/>
    );
  }

  //--------------------------------------------------
  // Repository
  //--------------------------------------------------

  if (source === "repository") {

    return (
      <div className="rounded-xl border bg-white p-10">

        <h2 className="text-2xl font-bold">
          Question Repository
        </h2>

        <p className="mt-2 text-slate-500">
          Coming in the next step...
        </p>

      </div>
    );

  }

  //--------------------------------------------------
  // Resources
  //--------------------------------------------------

  if (source === "resource") {

    return (
      <div className="rounded-xl border bg-white p-10">

        <h2 className="text-2xl font-bold">
          Upload Resources
        </h2>

        <p className="mt-2 text-slate-500">
          PDF / DOCX / PPT support coming next.
        </p>

      </div>
    );

  }

  //--------------------------------------------------
  // Hybrid
  //--------------------------------------------------

  if (source === "hybrid") {

    return (
      <div className="rounded-xl border bg-white p-10">

        <h2 className="text-2xl font-bold">
          Hybrid AI
        </h2>

        <p className="mt-2 text-slate-500">
          Repository + Gemini AI
        </p>

      </div>
    );

  }

  //--------------------------------------------------
  // Home
  //--------------------------------------------------

  return (

    <div className="space-y-8">

      <div className="rounded-xl border bg-white p-8 shadow-sm">

        <h2 className="text-3xl font-bold">
          AI Test Builder
        </h2>

        <p className="mt-2 text-slate-500">
          Choose how you would like to build
          your assessment.
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2">

        <SourceCard
          icon="📚"
          title="Question Bank"
          description="Select existing repository questions."
          onClick={() =>
            setSource("repository")
          }
        />

        <SourceCard
          icon="🤖"
          title="Gemini AI"
          description="Generate brand new questions using AI."
          onClick={() =>
            setSource("ai")
          }
        />

        <SourceCard
          icon="📄"
          title="Uploaded Resources"
          description="Generate questions from PDF, DOCX and PPT."
          onClick={() =>
            setSource("resource")
          }
        />

        <SourceCard
          icon="✨"
          title="Hybrid AI"
          description="Repository + AI generation."
          onClick={() =>
            setSource("hybrid")
          }
        />

      </div>

    </div>

  );
}