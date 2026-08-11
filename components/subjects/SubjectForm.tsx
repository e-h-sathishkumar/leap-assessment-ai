"use client";

import { useState } from "react";

import {
  createSubject,
  updateSubject,
} from "@/services/subject.service";

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

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData(
        event.currentTarget
      );

      const name =
        String(
          formData.get("name") ?? ""
        ).trim();

      const code =
        String(
          formData.get("code") ?? ""
        ).trim();

      const description =
        String(
          formData.get("description") ?? ""
        ).trim();

      if (!name) {
        toast.error(
          "Subject name is required."
        );
        return;
      }

      if (!code) {
        toast.error(
          "Subject code is required."
        );
        return;
      }

      if (mode === "create") {
        await createSubject({
          name,
          code,
          description,
        } as Subject);

        toast.success(
          "Subject created successfully."
        );
      } else {
        if (!subject?.id) {
          toast.error(
            "Invalid subject."
          );
          return;
        }

        await updateSubject(
          subject.id,
          {
            name,
            code,
            description,
          }
        );

        toast.success(
          "Subject updated successfully."
        );
      }

      onSuccess?.();
    } catch (error) {
      console.error(
        "SUBJECT SAVE ERROR:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to save subject."
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
      <div>
        <Label htmlFor="name">
          Subject Name
        </Label>

        <Input
          id="name"
          name="name"
          defaultValue={subject?.name ?? ""}
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
          defaultValue={subject?.code ?? ""}
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
          defaultValue={
            subject?.description ?? ""
          }
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