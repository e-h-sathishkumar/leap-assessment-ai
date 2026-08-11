"use client";

import { useEffect, useState } from "react";

import type { Subject } from "@/types/subject";
import type { Chapter } from "@/types/chapter";
import type { Topic } from "@/types/topic";

import { getSavedQuestions } from "@/services/test.service";
import { getChapters } from "@/services/chapter.service";
import { getTopicsByChapter } from "@/services/topic.service";

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
  const [chapterId, setChapterId] = useState("");
  const [topicId, setTopicId] = useState("");

  const [duration, setDuration] = useState("180");
  const [marks, setMarks] = useState("720");

  const [chapters, setChapters] = useState<Chapter[]>(
    []
  );

  const [topics, setTopics] = useState<Topic[]>(
    []
  );

  const [questions, setQuestions] = useState<any[]>(
    []
  );

  const [selectedQuestions, setSelectedQuestions] =
    useState<number[]>([]);

  // ==========================================================
  // LOAD CHAPTERS WHEN SUBJECT CHANGES
  // ==========================================================

  useEffect(() => {
    if (!subjectId) {
      setChapters([]);
      setTopics([]);
      setChapterId("");
      setTopicId("");
      return;
    }

    async function loadChapters() {
      try {
        const data = await getChapters(
          Number(subjectId)
        );

        setChapters(data);
      } catch (error) {
        console.error(
          "LOAD CHAPTERS ERROR:",
          error
        );

        setChapters([]);
      }
    }

    loadChapters();
  }, [subjectId]);

  // ==========================================================
  // LOAD TOPICS WHEN CHAPTER CHANGES
  // ==========================================================

  useEffect(() => {
    if (!chapterId) {
      setTopics([]);
      setTopicId("");
      return;
    }

    async function loadTopics() {
      try {
        const data =
          await getTopicsByChapter(
            Number(chapterId)
          );

        setTopics(data);
      } catch (error) {
        console.error(
          "LOAD TOPICS ERROR:",
          error
        );

        setTopics([]);
      }
    }

    loadTopics();
  }, [chapterId]);

  // ==========================================================
  // LOAD SAVED QUESTIONS
  // ==========================================================

  useEffect(() => {
    if (
      !subjectId ||
      !chapterId ||
      !topicId
    ) {
      setQuestions([]);
      return;
    }

    async function loadQuestions() {
      try {
        const data =
          await getSavedQuestions(
            Number(subjectId),
            Number(chapterId),
            Number(topicId)
          );

        setQuestions(data ?? []);
      } catch (error) {
        console.error(
          "LOAD QUESTIONS ERROR:",
          error
        );

        setQuestions([]);
      }
    }

    loadQuestions();
  }, [
    subjectId,
    chapterId,
    topicId,
  ]);

  // ==========================================================
  // SELECT / DESELECT QUESTION
  // ==========================================================

  function toggleQuestion(
    questionId: number,
    checked: boolean
  ) {
    if (checked) {
      setSelectedQuestions(
        (previous) =>
          previous.includes(questionId)
            ? previous
            : [
                ...previous,
                questionId,
              ]
      );

      return;
    }

    setSelectedQuestions(
      (previous) =>
        previous.filter(
          (id) => id !== questionId
        )
    );
  }

  // ==========================================================
  // SAVE TEST
  // ==========================================================

  function handleSave() {
    console.log(
      "CREATE TEST",
      {
        title,
        exam,
        subjectId,
        chapterId,
        topicId,
        duration,
        marks,
        selectedQuestions,
      }
    );

    /*
     * Test creation will be connected to the
     * test service here.
     *
     * For now this preserves the existing
     * Save Draft UI without changing the
     * working assessment pipeline.
     */

    setOpen(false);
  }

  // ==========================================================
  // UI
  // ==========================================================

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
          {/* Test Title */}

          <div>
            <Label htmlFor="test-title">
              Test Title
            </Label>

            <Input
              id="test-title"
              value={title}
              onChange={(event) =>
                setTitle(
                  event.target.value
                )
              }
              placeholder="NEET Physics Mock Test 1"
            />
          </div>

          {/* Exam */}

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

          {/* Subject */}

          <EntitySelect
            label="Subject"
            value={subjectId}
            options={subjects}
            optionLabel="name"
            optionValue="id"
            onChange={(value) => {
              setSubjectId(value);
              setChapterId("");
              setTopicId("");
              setSelectedQuestions([]);
            }}
          />

          {/* Chapter */}

          <EntitySelect
            label="Chapter"
            value={chapterId}
            options={chapters}
            optionLabel="name"
            optionValue="id"
            onChange={(value) => {
              setChapterId(value);
              setTopicId("");
              setSelectedQuestions([]);
            }}
          />

          {/* Topic */}

          <EntitySelect
            label="Topic"
            value={topicId}
            options={topics}
            optionLabel="name"
            optionValue="id"
            onChange={(value) => {
              setTopicId(value);
              setSelectedQuestions([]);
            }}
          />

          {/* Saved Questions */}

          {topicId && (
            <div>
              <Label>
                Saved Questions
              </Label>

              <div className="mt-2 max-h-64 overflow-y-auto rounded-lg border">
                {questions.length === 0 ? (
                  <div className="p-4 text-sm text-slate-500">
                    No saved questions found
                    for this topic.
                  </div>
                ) : (
                  <div className="divide-y">
                    {questions.map(
                      (question) => (
                        <label
                          key={question.id}
                          className="flex cursor-pointer items-start gap-3 p-3 hover:bg-slate-50"
                        >
                          <input
                            type="checkbox"
                            checked={selectedQuestions.includes(
                              question.id
                            )}
                            onChange={(event) =>
                              toggleQuestion(
                                question.id,
                                event.target
                                  .checked
                              )
                            }
                            className="mt-1"
                          />

                          <span className="text-sm text-slate-700">
                            {question.question ??
                              question.question_text ??
                              "Question"}
                          </span>
                        </label>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Duration + Marks */}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">
                Duration (Minutes)
              </Label>

              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(event) =>
                  setDuration(
                    event.target.value
                  )
                }
              />
            </div>

            <div>
              <Label htmlFor="marks">
                Total Marks
              </Label>

              <Input
                id="marks"
                type="number"
                value={marks}
                onChange={(event) =>
                  setMarks(
                    event.target.value
                  )
                }
              />
            </div>
          </div>

          {/* Save */}

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