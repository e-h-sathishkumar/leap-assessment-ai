"use client";

import { useMemo, useState } from "react";

import {
  createTopic,
  updateTopic,
} from "@/services/topic.service";

import type { Topic } from "@/types/topic";
import type { Subject } from "@/types/subject";
import type { Chapter } from "@/types/chapter";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import EntitySelect from "@/components/common/EntitySelect";

interface TopicFormProps {
  mode: "create" | "edit";
  topic?: Topic;
  subjects: Subject[];
  chapters: Chapter[];
  onSuccess?: () => void;
}

export default function TopicForm({
  mode,
  topic,
  subjects,
  chapters,
  onSuccess,
}: TopicFormProps) {
  const [loading, setLoading] = useState(false);

  // ==========================================================
  // INITIAL SUBJECT / CHAPTER
  // ==========================================================

  const initialSubjectId =
    chapters.find(
      (chapter) =>
        chapter.id === topic?.chapter_id
    )?.subject_id ?? 0;

  const [subjectId, setSubjectId] = useState(
    initialSubjectId.toString()
  );

  const [chapterId, setChapterId] = useState(
    topic?.chapter_id?.toString() ?? ""
  );

  // ==========================================================
  // FILTER CHAPTERS BY SUBJECT
  // ==========================================================

  const filteredChapters = useMemo(() => {
    if (!subjectId) {
      return [];
    }

    return chapters.filter(
      (chapter) =>
        chapter.subject_id ===
        Number(subjectId)
    );
  }, [chapters, subjectId]);

  // ==========================================================
  // SUBMIT
  // ==========================================================

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!chapterId) {
      toast.error(
        "Please select a chapter."
      );
      return;
    }

    const formData = new FormData(
      event.currentTarget
    );

    const name = String(
      formData.get("name") ?? ""
    ).trim();

    const description = String(
      formData.get("description") ?? ""
    ).trim();

    if (!name) {
      toast.error(
        "Topic name is required."
      );
      return;
    }

    try {
      setLoading(true);

      if (mode === "create") {
        await createTopic({
          name,
          chapter_id: Number(chapterId),
          description,
        } as Topic);

        toast.success(
          "Topic created successfully."
        );
      } else {
        if (!topic?.id) {
          toast.error(
            "Invalid topic."
          );
          return;
        }

        await updateTopic(
          topic.id,
          {
            name,
            chapter_id: Number(
              chapterId
            ),
            description,
          }
        );

        toast.success(
          "Topic updated successfully."
        );
      }

      onSuccess?.();
    } catch (error) {
      console.error(
        "TOPIC SAVE ERROR:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to save topic."
      );
    } finally {
      setLoading(false);
    }
  }

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* SUBJECT */}

      <EntitySelect
        label="Subject"
        value={subjectId}
        options={subjects}
        optionLabel="name"
        optionValue="id"
        onChange={(value) => {
          setSubjectId(value);
          setChapterId("");
        }}
      />

      {/* CHAPTER */}

      <EntitySelect
        label="Chapter"
        value={chapterId}
        options={filteredChapters}
        optionLabel="name"
        optionValue="id"
        onChange={setChapterId}
      />

      {/* TOPIC NAME */}

      <div>
        <Label htmlFor="name">
          Topic Name
        </Label>

        <Input
          id="name"
          name="name"
          defaultValue={
            topic?.name ?? ""
          }
          placeholder="Newton's Laws"
          required
        />
      </div>

      {/* DESCRIPTION */}

      <div>
        <Label htmlFor="description">
          Description
        </Label>

        <Textarea
          id="description"
          name="description"
          defaultValue={
            topic?.description ?? ""
          }
          placeholder="Optional description"
        />
      </div>

      {/* SAVE */}

      <Button
        type="submit"
        disabled={
          loading || !chapterId
        }
        className="w-full"
      >
        {loading
          ? mode === "create"
            ? "Saving..."
            : "Updating..."
          : mode === "create"
            ? "Save Topic"
            : "Update Topic"}
      </Button>
    </form>
  );
}