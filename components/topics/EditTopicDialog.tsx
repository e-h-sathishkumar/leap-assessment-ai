"use client";

import { useState } from "react";

import type { Topic } from "@/types/topic";
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

interface EditTopicDialogProps {
  topic: Topic;
  subjects: Subject[];
  chapters: Chapter[];
}

export default function EditTopicDialog({
  topic,
  subjects,
  chapters,
}: EditTopicDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
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
          <DialogTitle>
            Edit Topic
          </DialogTitle>
        </DialogHeader>

        <TopicForm
          mode="edit"
          topic={topic}
          subjects={subjects}
          chapters={chapters}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}