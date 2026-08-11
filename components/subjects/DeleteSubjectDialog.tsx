"use client";

import { useState } from "react";

import type { Subject } from "@/types/subject";
import { deleteSubject } from "@/services/subject.service";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DeleteSubjectDialogProps {
  subject: Subject;
}

export default function DeleteSubjectDialog({
  subject,
}: DeleteSubjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!subject.id) {
      toast.error("Invalid subject.");
      return;
    }

    try {
      setLoading(true);

      await deleteSubject(subject.id);

      toast.success(
        `Subject "${subject.name}" deleted successfully.`
      );

      setOpen(false);
    } catch (error) {
      console.error(
        "DELETE SUBJECT ERROR:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to delete subject."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
        >
          Delete
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Delete Subject
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete{" "}
            <strong>{subject.name}</strong>?
          </p>

          <p className="text-sm text-red-500">
            This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading
              ? "Deleting..."
              : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}