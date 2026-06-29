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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EntitySelect from "@/components/common/EntitySelect";

interface AddTestDialogProps {
  subjects: Subject[];
}

export default function AddTestDialog({
  subjects,
}: AddTestDialogProps) {
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [exam, setExam] = useState("NEET");
  const [subjectId, setSubjectId] = useState("");
  const [duration, setDuration] = useState("180");
  const [marks, setMarks] = useState("720");

  function handleSave() {
    console.log({
      title,
      exam,
      subjectId,
      duration,
      marks,
    });

    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button>
          + Create Test
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">

        <DialogHeader>
          <DialogTitle>
            Create Test
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">

          <div>
            <Label>
              Test Title
            </Label>

            <Input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="NEET Physics Mock Test 1"
            />
          </div>

          <EntitySelect
            label="Exam"
            value={exam}
            options={[
              {
                id: "NEET",
                name: "NEET",
              },
              {
                id: "JEE Main",
                name: "JEE Main",
              },
              {
                id: "JEE Advanced",
                name: "JEE Advanced",
              },
              {
                id: "CBSE",
                name: "CBSE",
              },
            ]}
            optionLabel="name"
            optionValue="id"
            onChange={setExam}
          />

          <EntitySelect
            label="Subject"
            value={subjectId}
            options={subjects}
            optionLabel="name"
            optionValue="id"
            onChange={setSubjectId}
          />

          <div className="grid grid-cols-2 gap-4">

            <div>

              <Label>
                Duration (Minutes)
              </Label>

              <Input
                type="number"
                value={duration}
                onChange={(e) =>
                  setDuration(
                    e.target.value
                  )
                }
              />

            </div>

            <div>

              <Label>
                Total Marks
              </Label>

              <Input
                type="number"
                value={marks}
                onChange={(e) =>
                  setMarks(
                    e.target.value
                  )
                }
              />

            </div>

          </div>

          <Button
            className="w-full"
            onClick={handleSave}
          >
            Save Draft
          </Button>

        </div>

      </DialogContent>

    </Dialog>
  );
}