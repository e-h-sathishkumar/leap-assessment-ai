"use client";

import { useState } from "react";

import {
  createChapter,
  updateChapter,
} from "@/services/chapter.service";

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
  const [loading, setLoading] =
    useState(false);

  const [subjectId, setSubjectId] =
    useState(
      chapter?.subject_id?.toString() ?? ""
    );

  const [name, setName] =
    useState(
      chapter?.name ?? ""
    );

  const [description, setDescription] =
    useState(
      chapter?.description ?? ""
    );

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!subjectId) {
      toast.error(
        "Please select a subject."
      );
      return;
    }

    if (!name.trim()) {
      toast.error(
        "Please enter a chapter name."
      );
      return;
    }

    setLoading(true);

    try {
      if (mode === "create") {
        await createChapter({
          subject_id: Number(subjectId),
          name: name.trim(),
          description:
            description.trim() ||
            undefined,
        } as Chapter);

        toast.success(
          "Chapter created successfully."
        );
      } else {
        if (!chapter?.id) {
          throw new Error(
            "Chapter ID is missing."
          );
        }

        await updateChapter(
          chapter.id,
          {
            subject_id: Number(subjectId),
            name: name.trim(),
            description:
              description.trim() ||
              undefined,
          }
        );

        toast.success(
          "Chapter updated successfully."
        );
      }

      onSuccess?.();

    } catch (error) {
      console.error(
        "Chapter save error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to save chapter."
      );

    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* SUBJECT */}

      <div className="space-y-2">

        <Label htmlFor="subject">
          Subject
        </Label>

        <Select
          value={subjectId}
          onValueChange={setSubjectId}
          disabled={loading}
        >
          <SelectTrigger
            id="subject"
            className="w-full"
          >
            <SelectValue placeholder="Select Subject" />
          </SelectTrigger>

          <SelectContent>
            {subjects.map(
              (subject) => (
                <SelectItem
                  key={subject.id}
                  value={String(
                    subject.id
                  )}
                >
                  {subject.name}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>

      </div>

      {/* CHAPTER NAME */}

      <div className="space-y-2">

        <Label htmlFor="name">
          Chapter Name
        </Label>

        <Input
          id="name"
          name="name"
          value={name}
          onChange={(event) =>
            setName(
              event.target.value
            )
          }
          placeholder="Mechanics"
          disabled={loading}
          required
        />

      </div>

      {/* DESCRIPTION */}

      <div className="space-y-2">

        <Label htmlFor="description">
          Description
        </Label>

        <Textarea
          id="description"
          name="description"
          value={description}
          onChange={(event) =>
            setDescription(
              event.target.value
            )
          }
          placeholder="Optional description"
          disabled={loading}
          rows={4}
        />

      </div>

      {/* SUBMIT */}

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