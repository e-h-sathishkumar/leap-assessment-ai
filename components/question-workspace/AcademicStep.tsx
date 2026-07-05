"use client";
import { getExamRule } from "@/lib/rules/examRules";

import { useEffect, useState } from "react";

import {
  getSubjects,
  getChapters,
  getTopics,
} from "@/services/repository.service";

interface Subject {
  id: number;
  name: string;
}

interface Chapter {
  id: number;
  name: string;
}

interface Topic {
  id: number;
  name: string;
}

interface Preview {
  exam: string;

  subject: string;
  chapter: string;
  topic: string;

  questionType: string;

  difficulty: string;

  totalQuestions: number;
}

interface AcademicStepProps {
  preview: Preview;
  setPreview: React.Dispatch<React.SetStateAction<Preview>>;
}

export default function AcademicStep({
  preview,
  setPreview,
}: AcademicStepProps) {


  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);


  const [subjectId, setSubjectId] = useState("");
  const [chapterId, setChapterId] = useState("");
  const [topicId, setTopicId] = useState("");

  useEffect(() => {
    loadSubjects();
  }, []);

  async function loadSubjects() {
    const data = await getSubjects();
    setSubjects(data ?? []);
  }

  async function handleSubjectChange(id: string) {
    setSubjectId(id);
    setChapterId("");
    setTopicId("");

    setChapters([]);
    setTopics([]);

    const selectedSubject = subjects.find(
      (s) => String(s.id) === id
    );

    setPreview((prev) => ({
      ...prev,
      subject: selectedSubject?.name ?? "",
      chapter: "",
      topic: "",
    }));

    

    const data = await getChapters(id);
    setChapters(data ?? []);
  }

  async function handleChapterChange(id: string) {
    setChapterId(id);
    setTopicId("");

    const selectedChapter = chapters.find(
      (c) => String(c.id) === id
    );

    setPreview((prev) => ({
      ...prev,
      chapter: selectedChapter?.name ?? "",
      topic: "",
    }));

    const data = await getTopics(id);
    setTopics(data ?? []);
  }

  function handleTopicChange(id: string) {
    setTopicId(id);

    const selectedTopic = topics.find(
      (t) => String(t.id) === id
    );

    setPreview((prev) => ({
      ...prev,
      topic: selectedTopic?.name ?? "",
    }));

    
  }
const rule = getExamRule(
  preview.exam,
  preview.questionType
);

const totalMarks =
  preview.totalQuestions * rule.marks;

const suggestedDuration =
  preview.totalQuestions *
  rule.suggestedTimePerQuestion;
  
  return (
    
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold">
        Academic Information
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
<div>
  <label className="mb-2 block font-medium">
    Exam
  </label>

  <select
    value={preview.exam}
    onChange={(e) =>
      setPreview((prev) => ({
        ...prev,
        exam: e.target.value,
      }))
    }
    className="w-full rounded-lg border p-3"
  >
    <option value="NEET">NEET</option>
    <option value="JEE Main">JEE Main</option>
    <option value="CBSE">CBSE</option>
  </select>
</div>

        {/* Subject */}

        <div>
          <label className="mb-2 block font-medium">
            Subject
          </label>

          <select
            value={subjectId}
            onChange={(e) =>
              handleSubjectChange(e.target.value)
            }
            className="w-full rounded-lg border p-3"
          >
            <option value="">
              Select Subject
            </option>

            {subjects.map((subject) => (
              <option
                key={subject.id}
                value={subject.id}
              >
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        {/* Chapter */}

        <div>
          <label className="mb-2 block font-medium">
            Chapter
          </label>

          <select
            value={chapterId}
            onChange={(e) =>
              handleChapterChange(e.target.value)
            }
            disabled={!subjectId}
            className="w-full rounded-lg border p-3"
          >
            <option value="">
              {subjectId
                ? "Select Chapter"
                : "Select Subject First"}
            </option>

            {chapters.map((chapter) => (
              <option
                key={chapter.id}
                value={chapter.id}
              >
                {chapter.name}
              </option>
            ))}
          </select>
        </div>

        {/* Topic */}

        <div>
          <label className="mb-2 block font-medium">
            Topic
          </label>

          <select
            value={topicId}
            onChange={(e) =>
              handleTopicChange(e.target.value)
            }
            disabled={!chapterId}
            className="w-full rounded-lg border p-3"
          >
            <option value="">
              {!chapterId
                ? "Select Chapter First"
                : topics.length === 0
                ? "No Topics Available"
                : "Select Topic"}
            </option>

            {topics.map((topic) => (
              <option
                key={topic.id}
                value={topic.id}
              >
                {topic.name}
              </option>
            ))}
          </select>

          {chapterId && topics.length === 0 && (
            <p className="mt-2 text-sm text-amber-600">
              No topics available for this chapter.
            </p>
          )}
        </div>

        {/* Difficulty */}

        <div>
          <label className="mb-2 block font-medium">
            Difficulty
          </label>

          <select
            value={preview.difficulty}
            onChange={(e) =>
              setPreview((prev) => ({
                ...prev,
                difficulty: e.target.value,
              }))
            }
            className="w-full rounded-lg border p-3"
          >
            <option value="">
              Select Difficulty
            </option>

            <option value="Easy">
              Easy
            </option>

            <option value="Medium">
              Medium
            </option>

            <option value="Hard">
              Hard
            </option>
          </select>
          <div>
  <label className="mb-2 block font-medium">
    Question Type
  </label>

  <select
    value={preview.questionType}
    onChange={(e) =>
      setPreview((prev) => ({
        ...prev,
        questionType: e.target.value,
      }))
    }
    className="w-full rounded-lg border p-3"
  >
    <option value="MCQ">MCQ</option>
    <option value="MSQ">MSQ</option>
    <option value="Integer">Integer</option>
    <option value="Assertion">
      Assertion
    </option>
  </select>
</div>
<div>
  <label className="mb-2 block font-medium">
    Number of Questions
  </label>

  <input
    type="number"
    min={1}
    max={200}
    value={preview.totalQuestions}
    onChange={(e) =>
      setPreview((prev) => ({
        ...prev,
        totalQuestions: Number(e.target.value),
      }))
    }
    className="w-full rounded-lg border p-3"
  />
</div>
<div className="mt-8 rounded-xl border bg-blue-50 p-5">

  <h3 className="text-lg font-semibold">
    Exam Summary
  </h3>

  <div className="mt-4 grid grid-cols-2 gap-4">

    <p>
      <strong>Marks / Question:</strong>{" "}
      {rule.marks}
    </p>

    <p>
      <strong>Negative Mark:</strong>{" "}
      -{rule.negativeMarks}
    </p>

    <p>
      <strong>Total Marks:</strong>{" "}
      {totalMarks}
    </p>

    <p>
      <strong>Suggested Duration:</strong>{" "}
      {suggestedDuration} Minutes
    </p>

  </div>

</div>
        </div>

      </div>
    </div>
  );
}