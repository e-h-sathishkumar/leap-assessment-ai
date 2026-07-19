
"use client";

import { useState } from "react";

import type { Chapter } from "@/types/chapter";
import type { Subject } from "@/types/subject";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import ChapterForm from "./ChapterForm";

interface EditChapterDialogProps {
  chapter: Chapter;
  subjects: Subject[];
}

export default function EditChapterDialog({
  chapter,
  subjects,
}: EditChapterDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
        >
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Chapter</DialogTitle>
        </DialogHeader>

        <ChapterForm
          mode="edit"
          chapter={chapter}
          subjects={subjects}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}