"use client";

import type { Subject } from "@/types/subject";
import type { Chapter } from "@/types/chapter";
import type { Topic } from "@/types/topic";

import AIGeneratorForm from "./AIGeneratorForm";

interface AIGeneratorProps {
  subjects: Subject[];
  chapters: Chapter[];
  topics: Topic[];
}

export default function AIGenerator({
  subjects,
  chapters,
  topics,
}: AIGeneratorProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          🤖 AI Question Generator
        </h1>

        <p className="mt-2 text-slate-500">
          Generate high-quality NEET, JEE and CBSE
          questions using AI.
        </p>
      </div>

      <AIGeneratorForm
        subjects={subjects}
        chapters={chapters}
        topics={topics}
      />
    </div>
  );
}