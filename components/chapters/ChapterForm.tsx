"use client";

import { useState } from "react";

import {
  createChapterAction,
  updateChapterAction,
} from "@/app/repository/chapters/actions";

import type { Chapter } from "@/types/chapter";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ChapterFormProps {
  mode: "create" | "edit";
  chapter?: Chapter;
  onSuccess?: () => void;
}

export default function ChapterForm({
  mode,
  chapter,
  onSuccess,
}: ChapterFormProps) {
  const [loading, setLoading] = useState(false);

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

    console.log("Action Result:", result);

if (!result.success) {
  toast.error(result.message);
  return;
}

toast.success(result.message);

console.log("Calling onSuccess()");
onSuccess?.();
  }

  return (
    <form
      action={handleSubmit}
      className="space-y-4"
    >
      <div>
        <Label htmlFor="subject_id">
          Subject ID
        </Label>

        <Input
          id="subject_id"
          name="subject_id"
          type="number"
          defaultValue={chapter?.subject_id}
          placeholder="1"
          required
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