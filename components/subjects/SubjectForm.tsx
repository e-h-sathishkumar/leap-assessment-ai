"use client";

import { useState } from "react";

import {
  createSubjectAction,
  updateSubjectAction,
} from "@/app/repository/subjects/actions";

import type { Subject } from "@/types/subject";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SubjectFormProps {
  mode: "create" | "edit";
  subject?: Subject;
  onSuccess?: () => void;
}

export default function SubjectForm({
  mode,
  subject,
  onSuccess,
}: SubjectFormProps) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);

    const result =
      mode === "create"
        ? await createSubjectAction(formData)
        : await updateSubjectAction(
            subject!.id!,
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
      <div>
        <Label htmlFor="name">
          Subject Name
        </Label>

        <Input
          id="name"
          name="name"
          defaultValue={subject?.name}
          placeholder="Physics"
          required
        />
      </div>

      <div>
        <Label htmlFor="code">
          Subject Code
        </Label>

        <Input
          id="code"
          name="code"
          defaultValue={subject?.code}
          placeholder="PHY"
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
          defaultValue={subject?.description}
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
          ? "Save Subject"
          : "Update Subject"}
      </Button>
    </form>
  );
}