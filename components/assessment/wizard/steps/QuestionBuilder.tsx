"use client";

// ====================================================
// Component : QuestionBuilder
// Module    : Assessment Wizard
// Purpose   : Step 3 - Question Builder
// ====================================================

import { useState } from "react";

import {
  BookOpen,
  Bot,
  FileText,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import AIGenerator from "@/components/question-workspace/ai/AIGenerator";

// Repository
import SubjectFilter from "./question-selection/SubjectFilter";
import ChapterFilter from "./question-selection/ChapterFilter";
import TopicFilter from "./question-selection/TopicFilter";
import QuestionList from "./question-selection/QuestionList";
import SelectedQuestions from "./question-selection/SelectedQuestions";

import type { Subject } from "@/types/subject";
import type { Chapter } from "@/types/chapter";
import type { Topic } from "@/types/topic";

interface Props {
  subjects: Subject[];
  chapters: Chapter[];
  topics: Topic[];
}

type Source =
  | "none"
  | "repository"
  | "ai"
  | "resource"
  | "hybrid";

export default function QuestionBuilder({
  subjects,
  chapters,
  topics,
}: Props) {
  const [source, setSource] =
    useState<Source>("none");

  //---------------------------------------------------
  // AI
  //---------------------------------------------------

  if (source === "ai") {
    return (
      <div className="space-y-6">

        <Button
          variant="outline"
          onClick={() => setSource("none")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />

          Back
        </Button>

        <AIGenerator
          subjects={subjects}
          chapters={chapters}
          topics={topics}
        />

      </div>
    );
  }

  //---------------------------------------------------
  // Repository
  //---------------------------------------------------

  if (source === "repository") {
    return (
      <div className="space-y-6">

        <Button
          variant="outline"
          onClick={() => setSource("none")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />

          Back
        </Button>

        <div className="rounded-xl border bg-white p-8 shadow-sm">

          <h2 className="text-2xl font-bold">
            Question Repository
          </h2>

          <p className="mt-2 text-slate-500">
            Select questions from your repository.
          </p>

        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          <SubjectFilter />

          <ChapterFilter />

          <TopicFilter />

        </div>

        <QuestionList />

        <SelectedQuestions />

      </div>
    );
  }

  //---------------------------------------------------
  // Resource
  //---------------------------------------------------

  if (source === "resource") {
    return (
      <div className="space-y-6">

        <Button
          variant="outline"
          onClick={() => setSource("none")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />

          Back
        </Button>

        <div className="rounded-xl border bg-white p-12 shadow-sm text-center">

          <FileText className="mx-auto h-12 w-12 text-slate-400" />

          <h2 className="mt-4 text-2xl font-bold">
            Uploaded Resources
          </h2>

          <p className="mt-2 text-slate-500">
            Upload PDF, DOCX or PPT and let Gemini
            generate questions.
          </p>

          <Button className="mt-8">
            Upload Resource
          </Button>

        </div>

      </div>
    );
  }

  //---------------------------------------------------
  // Hybrid
  //---------------------------------------------------

  if (source === "hybrid") {
    return (
      <div className="space-y-6">

        <Button
          variant="outline"
          onClick={() => setSource("none")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />

          Back
        </Button>

        <div className="rounded-xl border bg-white p-12 shadow-sm text-center">

          <Sparkles className="mx-auto h-12 w-12 text-yellow-500" />

          <h2 className="mt-4 text-2xl font-bold">
            Hybrid AI
          </h2>

          <p className="mt-2 text-slate-500">
            Repository + Gemini AI generation.
          </p>

          <Button className="mt-8">
            Continue
          </Button>

        </div>

      </div>
    );
  }

  //---------------------------------------------------
  // Source Selection
  //---------------------------------------------------

  return (
    <div className="space-y-8">

      <div className="rounded-xl border bg-white p-8 shadow-sm">

        <h2 className="text-3xl font-bold">
          Question Builder
        </h2>

        <p className="mt-2 text-slate-500">
          Choose how you would like to build
          this assessment.
        </p>

      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Repository */}

        <SourceCard
          icon={<BookOpen className="h-10 w-10 text-blue-600" />}
          title="Question Bank"
          description="Build a test using existing repository questions."
          onClick={() => setSource("repository")}
        />

        {/* AI */}

        <SourceCard
          icon={<Bot className="h-10 w-10 text-violet-600" />}
          title="Gemini AI"
          description="Generate completely new questions using AI."
          onClick={() => setSource("ai")}
        />

        {/* Resource */}

        <SourceCard
          icon={<FileText className="h-10 w-10 text-green-600" />}
          title="Uploaded Resources"
          description="Generate questions from uploaded PDF, DOCX or PPT."
          onClick={() => setSource("resource")}
        />

        {/* Hybrid */}

        <SourceCard
          icon={<Sparkles className="h-10 w-10 text-yellow-500" />}
          title="Hybrid AI"
          description="Use repository first and AI for missing questions."
          onClick={() => setSource("hybrid")}
        />

      </div>

    </div>
  );
}

interface CardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

function SourceCard({
  icon,
  title,
  description,
  onClick,
}: CardProps) {
  return (
    <div className="rounded-xl border bg-white p-8 shadow-sm transition hover:shadow-lg">

      <div>{icon}</div>

      <h3 className="mt-5 text-2xl font-bold">
        {title}
      </h3>

      <p className="mt-3 text-slate-500">
        {description}
      </p>

      <Button
        className="mt-8 w-full"
        onClick={onClick}
      >
        Continue
      </Button>

    </div>
  );
}