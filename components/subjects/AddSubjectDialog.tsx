"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import SubjectForm from "@/components/subjects/SubjectForm";

export default function AddSubjectDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Subject</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Subject</DialogTitle>
        </DialogHeader>

        <SubjectForm />
      </DialogContent>
    </Dialog>
  );
}