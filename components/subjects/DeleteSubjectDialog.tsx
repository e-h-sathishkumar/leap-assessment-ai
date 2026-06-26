"use client";

import { useState } from "react";

import { deleteSubjectAction } from "@/app/repository/subjects/actions";
import type { Subject } from "@/types/subject";

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
    setLoading(true);

    const result = await deleteSubjectAction(subject.id!);

    setLoading(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);

    setOpen(false);
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

        <p className="text-sm text-slate-600">
          Are you sure you want to delete{" "}
          <strong>{subject.name}</strong>?
        </p>

        <p className="text-sm text-red-500">
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
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