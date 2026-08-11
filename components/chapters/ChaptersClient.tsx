"use client";

import { useMemo, useState } from "react";

import type { Chapter } from "@/types/chapter";
import type { Subject } from "@/types/subject";

import AddChapterDialog from "./AddChapterDialog";
import ChapterSearch from "./ChapterSearch";
import ChapterStats from "./ChapterStats";
import ChapterTable from "./ChapterTable";

interface ChaptersClientProps {
  chapters: Chapter[];
  subjects: Subject[];
}

export default function ChaptersClient({
  chapters,
  subjects,
}: ChaptersClientProps) {
  const [search, setSearch] =
    useState("");

  const filteredChapters =
    useMemo(() => {
      const value =
        search.trim().toLowerCase();

      if (!value) {
        return chapters;
      }

      return chapters.filter(
        (chapter) => {
          const subject =
            subjects.find(
              (item) =>
                item.id ===
                chapter.subject_id
            );

          const chapterName =
            chapter.name
              ?.toLowerCase() ?? "";

          const subjectName =
            subject?.name
              ?.toLowerCase() ?? "";

          const chapterCode =
            chapter.code
              ?.toLowerCase() ?? "";

          return (
            chapterName.includes(value) ||
            subjectName.includes(value) ||
            chapterCode.includes(value)
          );
        }
      );
    }, [chapters, subjects, search]);

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Chapter Management
          </h1>

          <p className="mt-1 text-slate-500">
            Manage all chapters
          </p>
        </div>

        <AddChapterDialog
          subjects={subjects}
        />

      </div>

      {/* STATS */}

      <ChapterStats
        chapters={chapters}
      />

      {/* SEARCH */}

      <ChapterSearch
        value={search}
        onChange={setSearch}
      />

      {/* TABLE */}

      <ChapterTable
        chapters={filteredChapters}
        subjects={subjects}
      />

    </div>
  );
}