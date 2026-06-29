"use client";

import { useMemo, useState } from "react";

import {
  createTopicAction,
  updateTopicAction,
} from "@/app/repository/topics/actions";

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

  const initialSubjectId =
    chapters.find(
      (chapter) => chapter.id === topic?.chapter_id
    )?.subject_id ?? 0;

  const [subjectId, setSubjectId] = useState(
    initialSubjectId.toString()
  );

  const [chapterId, setChapterId] = useState(
    topic?.chapter_id?.toString() ?? ""
  );

  const filteredChapters = useMemo(() => {
    return chapters.filter(
      (chapter) =>
        chapter.subject_id === Number(subjectId)
    );
  }, [chapters, subjectId]);

  async function handleSubmit(
    formData: FormData
  ) {
    setLoading(true);

    const result =
      mode === "create"
        ? await createTopicAction(formData)
        : await updateTopicAction(
            topic!.id!,
            formData
          );

    setLoading(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);

    onSuccess?.();
  }

  return (
    <form
      action={handleSubmit}
      className="space-y-4"
    >
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

      <EntitySelect
        label="Chapter"
        value={chapterId}
        options={filteredChapters}
        optionLabel="name"
        optionValue="id"
        onChange={setChapterId}
      />

      <input
        type="hidden"
        name="chapter_id"
        value={chapterId}
      />

      <div>
        <Label htmlFor="name">
          Topic Name
        </Label>

        <Input
          id="name"
          name="name"
          defaultValue={topic?.name}
          placeholder="Newton's Laws"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">
          Description
        </Label>

        <Textarea
          id="description"
          name="description"
          defaultValue={topic?.description}
          placeholder="Optional description"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
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