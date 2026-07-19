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

    {/* Basic Information */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

     <FormInput
  label="Test Title"
  value={form.title}
  placeholder="Enter Test Title"
  onChange={(value) =>
    setForm({
      ...form,
      title: value,
    })
  }
/>

      <div>
        <Label>Exam Type</Label>
        <Input
          value={form.examType}
          onChange={(e) =>
            setForm({
              ...form,
              examType: e.target.value,
            })
          }
        />
      </div>

    </div>

    <div className="mb-8">
      <Label>Description</Label>

      <Textarea
        value={form.description}
        onChange={(e) =>
          setForm({
            ...form,
            description: e.target.value,
          })
        }
      />
    </div>

    {/* Academic Selection */}

<div className="grid grid-cols-1 gap-8 md:grid-cols-3">

  {/* Subjects */}

  <div className="rounded-lg border p-4">

    <h3 className="mb-4 text-lg font-semibold">
      Subjects
    </h3>

    <div className="space-y-2">

      {subjects.map((subject) => (

        <label
          key={subject.id}
          className="flex items-center gap-3"
        >

          <input
            type="checkbox"
            checked={form.subjectIds.includes(subject.id)}
            onChange={(e) =>
              handleSubjectChange(
                subject,
                e.target.checked
              )
            }
          />

          <span>{subject.name}</span>

        </label>

      ))}

    </div>

  </div>

  {/* Chapters */}

  <div className="rounded-lg border p-4">

    <h3 className="mb-4 text-lg font-semibold">
      Chapters
    </h3>

    {loadingChapters ? (

      <p>Loading...</p>

    ) : (

      <div className="space-y-2">

        {chapters.map((chapter) => (

          <label
            key={chapter.id}
            className="flex items-center gap-3"
          >

            <input
              type="checkbox"
              checked={form.chapterIds.includes(chapter.id)}
              onChange={(e) =>
                handleChapterChange(
                  chapter,
                  e.target.checked
                )
              }
            />

            <span>{chapter.name}</span>

          </label>

        ))}

      </div>

    )}

  </div>

  {/* Topics */}

  <div className="rounded-lg border p-4">

    <h3 className="mb-4 text-lg font-semibold">
      Topics
    </h3>

    {loadingTopics ? (

      <p>Loading...</p>

    ) : (

      <div className="space-y-2">

        {topics.map((topic) => (

          <label
            key={topic.id}
            className="flex items-center gap-3"
          >

            <input
              type="checkbox"
              checked={form.topicIds.includes(topic.id)}
              onChange={(e) =>
                handleTopicChange(
                  topic,
                  e.target.checked
                )
              }
            />

            <span>{topic.name}</span>

          </label>

        ))}

      </div>

    )}

  </div>

</div>
  </div>
);
} 