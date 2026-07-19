"use client";

import { useState } from "react";
import { getSavedQuestions } from "@/services/test.service";

import type { Subject } from "@/types/subject";
import { useEffect } from "react";

import { getChapters } from "@/services/chapter.service";
import { getTopicsByChapter } from "@/services/topic.service";

import type { Chapter } from "@/types/chapter";
import type { Topic } from "@/types/topic";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EntitySelect from "@/components/common/EntitySelect";

interface AddTestDialogProps {
  subjects: Subject[];
}


export default function AddTestDialog({
  subjects,
}: AddTestDialogProps) {
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [exam, setExam] = useState("NEET");
  const [subjectId, setSubjectId] = useState("");
  const [duration, setDuration] = useState("180");
  const [marks, setMarks] = useState("720");
const [chapters, setChapters] = useState<Chapter[]>([]);
const [topics, setTopics] = useState<Topic[]>([]);

const [chapterId, setChapterId] = useState("");
const [topicId, setTopicId] = useState("");
const [questions, setQuestions] = useState<any[]>([]);
const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
useEffect(() => {
  if (!subjectId) {
    setChapters([]);
    setTopics([]);
    setChapterId("");
    setTopicId("");
    return;
  }
useEffect(() => {
  if (!topicId) {
    setQuestions([]);
    return;
  }

  async function loadQuestions() {
    const data = await getSavedQuestions(
      Number(subjectId),
      Number(chapterId),
      Number(topicId)
    );

    setQuestions(data);
  }

  loadQuestions();
}, [subjectId, chapterId, topicId]);

  async function loadChapters() {
    const data = await getChapters(Number(subjectId));
    setChapters(data);
  }

  loadChapters();
}, [subjectId]);

useEffect(() => {
  if (!chapterId) {
    setTopics([]);
    setTopicId("");
    return;
  }

  async function loadTopics() {
    const data = await getTopicsByChapter(Number(chapterId));
    setTopics(data);
  }

  loadTopics();
}, [chapterId]);

  function handleSave() {
    console.log({
      title,
      exam,
      subjectId,
      duration,
      marks,
    });
  
  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button>
          + Create Test
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">

        <DialogHeader>
          <DialogTitle>
            Create Test
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">

          <div>
            <Label>
              Test Title
            </Label>

            <Input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="NEET Physics Mock Test 1"
            />
          </div>

          <EntitySelect
            label="Exam"
            value={exam}
            options={[
              {
                id: "NEET",
                name: "NEET",
              },
              {
                id: "JEE Main",
                name: "JEE Main",
              },
              {
                id: "JEE Advanced",
                name: "JEE Advanced",
              },
              {
                id: "CBSE",
                name: "CBSE",
              },
            ]}
            optionLabel="name"
            optionValue="id"
            onChange={setExam}
          />

          <EntitySelect
            label="Subject"
            value={subjectId}
            options={subjects}
            optionLabel="name"
            optionValue="id"
            onChange={setSubjectId}
          />
<EntitySelect
  label="Chapter"
  value={chapterId}
  options={chapters}
  optionLabel="name"
  optionValue="id"
  onChange={setChapterId}
/>

<EntitySelect
  label="Topic"
  value={topicId}
  options={topics}
  optionLabel="name"
  optionValue="id"
  onChange={setTopicId}
/>
<div className="rounded-lg border p-4">

  <h3 className="mb-3 font-semibold">
    Saved Questions
  </h3>

  <div className="max-h-64 overflow-y-auto space-y-2">

    {questions.map((q) => (

      <label
        key={q.id}
        className="flex items-start gap-3 border-b pb-2"
      >

        <input
          type="checkbox"
          checked={selectedQuestions.includes(q.id)}
          onChange={(e) => {

            if (e.target.checked) {

              setSelectedQuestions([
                ...selectedQuestions,
                q.id,
              ]);

            } else {

              setSelectedQuestions(
                selectedQuestions.filter(
                  (id) => id !== q.id
                )
              );

            }

          }}
        />

        <span>
          {q.question}
        </span>

      </label>

    ))}

  </div>

</div>

          <div className="grid grid-cols-2 gap-4">

            <div>

              <Label>
                Duration (Minutes)
              </Label>

              <Input
                type="number"
                value={duration}
                onChange={(e) =>
                  setDuration(
                    e.target.value
                  )
                }
              />

            </div>

            <div>

              <Label>
                Total Marks
              </Label>

              <Input
                type="number"
                value={marks}
                onChange={(e) =>
                  setMarks(
                    e.target.value
                  )
                }
              />

            </div>

          </div>

          <Button
            className="w-full"
            onClick={handleSave}
          >
            Save Draft
          </Button>

        </div>

      </DialogContent>

    </Dialog>
  );
}
}