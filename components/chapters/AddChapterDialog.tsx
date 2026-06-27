"use client";

import { useState } from "react";

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

interface AddChapterDialogProps {
  subjects: Subject[];
}

export default function AddChapterDialog({
  subjects,
}: AddChapterDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button>Add Chapter</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Chapter</DialogTitle>
        </DialogHeader>

        <ChapterForm
          mode="create"
          subjects={subjects}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}