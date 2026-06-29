"use client";

import { useMemo, useState } from "react";

import type { Topic } from "@/types/topic";
import type { Subject } from "@/types/subject";
import type { Chapter } from "@/types/chapter";

import AddTopicDialog from "./AddTopicDialog";
import TopicSearch from "./TopicSearch";
import TopicStats from "./TopicStats";
import TopicTable from "./TopicTable";

interface TopicsClientProps {
  topics: Topic[];
  subjects: Subject[];
  chapters: Chapter[];
}

export default function TopicsClient({
  topics,
  subjects,
  chapters,
}: TopicsClientProps) {
  const [search, setSearch] = useState("");

  const filteredTopics = useMemo(() => {
    const keyword = search.toLowerCase();

    return topics.filter(
      (topic) =>
        topic.name.toLowerCase().includes(keyword) ||
        topic.chapters?.name
          ?.toLowerCase()
          .includes(keyword) ||
        topic.chapters?.subjects?.name
          ?.toLowerCase()
          .includes(keyword)
    );
  }, [topics, search]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Topic Management
          </h1>

          <p className="mt-1 text-slate-500">
            Manage all topics
          </p>
        </div>

        <AddTopicDialog
          subjects={subjects}
          chapters={chapters}
        />
      </div>

      <TopicStats topics={topics} />

      <TopicSearch
        value={search}
        onChange={setSearch}
      />

      <TopicTable
        topics={filteredTopics}
        subjects={subjects}
        chapters={chapters}
      />
    </div>
  );
}