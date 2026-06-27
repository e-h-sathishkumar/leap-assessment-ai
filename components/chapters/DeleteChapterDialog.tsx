"use client";

import { useState } from "react";

import { deleteChapterAction } from "@/app/repository/chapters/actions";
import type { Chapter } from "@/types/chapter";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DeleteChapterDialogProps {
  chapter: Chapter;
}

export default function DeleteChapterDialog({
  chapter,
}: DeleteChapterDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);

    const result = await deleteChapterAction(chapter.id!);

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
            Delete Chapter
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-slate-600">
          Are you sure you want to delete{" "}
          <strong>{chapter.name}</strong>?
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