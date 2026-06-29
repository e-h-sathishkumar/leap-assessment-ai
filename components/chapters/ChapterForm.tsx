"use client";

import { useState } from "react";

import {
  createChapterAction,
  updateChapterAction,
} from "@/app/repository/chapters/actions";

import type { Chapter } from "@/types/chapter";
import type { Subject } from "@/types/subject";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChapterFormProps {
  mode: "create" | "edit";
  chapter?: Chapter;
  subjects: Subject[];
  onSuccess?: () => void;
}

export default function ChapterForm({
  mode,
  chapter,
  subjects,
  onSuccess,
}: ChapterFormProps) {
  const [loading, setLoading] = useState(false);

  const [subjectId, setSubjectId] = useState(
    chapter?.subject_id?.toString() ?? ""
  );

  async function handleSubmit(formData: FormData) {
    setLoading(true);

    const result =
      mode === "create"
        ? await createChapterAction(formData)
        : await updateChapterAction(
            chapter!.id!,
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
      <div className="space-y-2">
        <Label>Subject</Label>

        <Select
          value={subjectId}
          onValueChange={setSubjectId}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Subject" />
          </SelectTrigger>

          <SelectContent>
            {subjects.map((subject) => (
              <SelectItem
                key={subject.id}
                value={subject.id!.toString()}
              >
                {subject.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <input
          type="hidden"
          name="subject_id"
          value={subjectId}
        />
      </div>

      <div>
        <Label htmlFor="name">
          Chapter Name
        </Label>

        <Input
          id="name"
          name="name"
          defaultValue={chapter?.name}
          placeholder="Mechanics"
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
          defaultValue={chapter?.description}
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
          ? "Save Chapter"
          : "Update Chapter"}
      </Button>
    </form>
  );
}