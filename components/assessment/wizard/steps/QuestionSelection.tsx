"use client";

// ====================================================
// Component : QuestionSelection
// Module    : Assessment Wizard
// Purpose   : Step 3 - Question Selection
// ====================================================
import { useState } from "react";

import AIGenerator from "@/components/question-workspace/ai/AIGenerator";
import SubjectFilter from "./question-selection/SubjectFilter";
import ChapterFilter from "./question-selection/ChapterFilter";
import TopicFilter from "./question-selection/TopicFilter";
import QuestionList from "./question-selection/QuestionList";
import SelectedQuestions from "./question-selection/SelectedQuestions";

export default function QuestionSelection() {
  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="rounded-xl border bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold">
          Question Selection
        </h2>

        <p className="mt-2 text-slate-500">
          Select questions from the repository to include in this test.
        </p>
      </div>

      {/* Filters */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        <SubjectFilter />

        <ChapterFilter />

        <TopicFilter />

      </div>

      {/* Questions */}

      <QuestionList />

      {/* Selected */}

      <SelectedQuestions />

    </div>
  );
}