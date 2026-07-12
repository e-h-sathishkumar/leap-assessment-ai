"use client";

import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

import FormInput from "@/components/shared/form/FormInput";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { getSubjects } from "@/services/subject.service";
import { getChapters } from "@/services/chapter.service";
import { getTopicsByChapter } from "@/services/topic.service";

import type { Subject } from "@/types/subject";
import type { Chapter } from "@/types/chapter";
import type { Topic } from "@/types/topic";
import type { CreateTestForm } from "@/types/test";

interface BasicDetailsProps {
  form: CreateTestForm;
  setForm: Dispatch<SetStateAction<CreateTestForm>>;
}

export default function BasicDetails({ form, setForm }: BasicDetailsProps) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);

  const [loadingChapters, setLoadingChapters] = useState(false);
  const [loadingTopics, setLoadingTopics] = useState(false);

  // Helper for deduplication
  const dedupe = <T extends { id: number }>(arr: T[]) =>
    arr.filter((item, index, self) => index === self.findIndex((t) => t.id === item.id));

  // Initial Load
  useEffect(() => {
    getSubjects().then(setSubjects).catch(console.error);
  }, []);

  // Reactive Fetching: Chapters
  useEffect(() => {
    if (form.subjectIds.length === 0) {
      setChapters([]);
      return;
    }
    
    async function load() {
      setLoadingChapters(true);
      try {
        const results = await Promise.all(form.subjectIds.map((id) => getChapters(id)));
        setChapters(dedupe(results.flat()));
      } catch (err) {
        console.error("Failed to load chapters", err);
      } finally {
        setLoadingChapters(false);
      }
    }
    load();
  }, [form.subjectIds]);

  // Reactive Fetching: Topics
  useEffect(() => {
    if (form.chapterIds.length === 0) {
      setTopics([]);
      return;
    }
    
    async function load() {
      setLoadingTopics(true);
      try {
        const results = await Promise.all(form.chapterIds.map((id) => getTopicsByChapter(id)));
        setTopics(dedupe(results.flat()));
      } catch (err) {
        console.error("Failed to load topics", err);
      } finally {
        setLoadingTopics(false);
      }
    }
    load();
  }, [form.chapterIds]);

  // Handlers
  const handleSubjectChange = (subject: Subject, checked: boolean) => {
    const nextIds = checked ? [...form.subjectIds, subject.id] : form.subjectIds.filter((id) => id !== subject.id);
    
    // Explicitly clear UI lists immediately
    setChapters([]);
    setTopics([]);

    setForm({
      ...form,
      subjectIds: nextIds,
      subjectNames: subjects.filter((s) => nextIds.includes(s.id)).map((s) => s.name),
      chapterIds: [], chapterNames: [], topicIds: [], topicNames: [],
    });
  };

  const handleChapterChange = (chapter: Chapter, checked: boolean) => {
    const nextIds = checked ? [...form.chapterIds, chapter.id] : form.chapterIds.filter((id) => id !== chapter.id);
    
    // Explicitly clear Topics
    setTopics([]);

    setForm({
      ...form,
      chapterIds: nextIds,
      chapterNames: chapters.filter((c) => nextIds.includes(c.id)).map((c) => c.name),
      topicIds: [], topicNames: [],
    });
  };

  const handleTopicChange = (topic: Topic, checked: boolean) => {
    const nextIds = checked ? [...form.topicIds, topic.id] : form.topicIds.filter((id) => id !== topic.id);
    
    setForm({
      ...form,
      topicIds: nextIds,
      topicNames: topics.filter((t) => nextIds.includes(t.id)).map((t) => t.name),
    });
  };

  return (
    <div className="rounded-xl border bg-white p-8 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Subjects */}
        <div className="space-y-2">
          <Label>Subjects *</Label>
          <div className="h-64 overflow-y-auto rounded-md border p-4 space-y-2">
            {subjects.map((s) => (
              <label key={s.id} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.subjectIds.includes(s.id)} onChange={(e) => handleSubjectChange(s, e.target.checked)} />
                {s.name}
              </label>
            ))}
          </div>
        </div>

        {/* Chapters */}
        <div className="space-y-2">
          <Label>Chapters</Label>
          <div className="h-64 overflow-y-auto rounded-md border p-4 space-y-2">
            {loadingChapters && <p className="text-xs text-slate-500">Loading chapters...</p>}
            {!loadingChapters && chapters.length === 0 && <p className="text-sm text-slate-400">Select subject(s) to load chapters.</p>}
            {chapters.map((c) => (
              <label key={c.id} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.chapterIds.includes(c.id)} onChange={(e) => handleChapterChange(c, e.target.checked)} />
                {c.name}
              </label>
            ))}
          </div>
        </div>

        {/* Topics */}
        <div className="space-y-2">
          <Label>Topics</Label>
          <div className="h-64 overflow-y-auto rounded-md border p-4 space-y-2">
            {loadingTopics && <p className="text-xs text-slate-500">Loading topics...</p>}
            {!loadingTopics && topics.length === 0 && <p className="text-sm text-slate-400">Select chapter(s) to load topics.</p>}
            {topics.map((t) => (
              <label key={t.id} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.topicIds.includes(t.id)} onChange={(e) => handleTopicChange(t, e.target.checked)} />
                {t.name}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}