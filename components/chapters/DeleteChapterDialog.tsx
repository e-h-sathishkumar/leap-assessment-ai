"use client";

import { useState } from "react";

import type { Chapter } from "@/types/chapter";

import { deleteChapter } from "@/services/chapter.service";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { toast } from "sonner";

interface DeleteChapterDialogProps {
  chapter: Chapter;
}

export default function DeleteChapterDialog({
  chapter,
}: DeleteChapterDialogProps) {
  const [open, setOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  async function handleDelete() {
    if (!chapter.id) {
      toast.error(
        "Chapter ID is missing."
      );
      return;
    }

    setLoading(true);

    try {
      await deleteChapter(
        chapter.id
      );

      toast.success(
        "Chapter deleted successfully."
      );

      setOpen(false);

      // Refresh the current page
      window.location.reload();

    } catch (error) {
      console.error(
        "Delete chapter error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to delete chapter."
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
          type="button"
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

        <div className="space-y-4">

          <p className="text-sm leading-6 text-slate-600">
            Are you sure you want to
            delete{" "}
            <strong>
              {chapter.name}
            </strong>
            ?
          </p>

          <p className="text-sm text-red-600">
            This action cannot be undone.
          </p>

          <div className="flex justify-end gap-3">

            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() =>
                setOpen(false)
              }
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="destructive"
              disabled={loading}
              onClick={handleDelete}
            >
              {loading
                ? "Deleting..."
                : "Delete Chapter"}
            </Button>

          </div>

        </div>

      </DialogContent>
    </Dialog>
  );
}