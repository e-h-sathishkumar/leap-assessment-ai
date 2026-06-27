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
  const [search, setSearch] = useState("");

  const filteredChapters = useMemo(() => {
    const value = search.toLowerCase();

    return chapters.filter(
      (chapter) =>
        chapter.name.toLowerCase().includes(value) ||
        chapter.subjects?.name
          ?.toLowerCase()
          .includes(value)
    );
  }, [chapters, search]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
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

      <ChapterStats chapters={chapters} />

      <ChapterSearch
        value={search}
        onChange={setSearch}
      />

      <ChapterTable
  chapters={filteredChapters}
  subjects={subjects}
/>
    </div>
  );
}