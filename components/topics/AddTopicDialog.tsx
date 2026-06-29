"use client";

import { useState } from "react";

import type { Subject } from "@/types/subject";
import type { Chapter } from "@/types/chapter";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import TopicForm from "./TopicForm";

interface AddTopicDialogProps {
  subjects: Subject[];
  chapters: Chapter[];
}

export default function AddTopicDialog({
  subjects,
  chapters,
}: AddTopicDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button>Add Topic</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Add Topic
          </DialogTitle>
        </DialogHeader>

        <TopicForm
          mode="create"
          subjects={subjects}
          chapters={chapters}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}