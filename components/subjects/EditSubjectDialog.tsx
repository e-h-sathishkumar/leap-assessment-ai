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
import SubjectForm from "./SubjectForm";

interface EditSubjectDialogProps {
  subject: Subject;
}

export default function EditSubjectDialog({
  subject,
}: EditSubjectDialogProps) {
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
            Edit Subject
          </DialogTitle>
        </DialogHeader>

        <SubjectForm
          mode="edit"
          subject={subject}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}