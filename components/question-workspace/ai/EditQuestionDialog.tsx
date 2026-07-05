"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AIQuestion {
  question: string;

  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };

  correct_answer: string;

  explanation?: string;
  hint?: string;
}

interface Props {
  open: boolean;

  question: AIQuestion | null;

  onClose: () => void;

  onSave: (question: AIQuestion) => void;
}

export default function EditQuestionDialog({
  open,
  question,
  onClose,
  onSave,
}: Props) {
  const [edited, setEdited] =
    useState<AIQuestion | null>(null);

  useEffect(() => {
    setEdited(question);
  }, [question]);

  if (!edited) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={onClose}
    >
      <DialogContent className="max-w-4xl">

        <DialogHeader>

          <DialogTitle>
            Edit Question
          </DialogTitle>

        </DialogHeader>

        <div className="space-y-5">

          <div>

            <Label>Question</Label>

            <Input
              value={edited.question}
              onChange={(e) =>
                setEdited({
                  ...edited,
                  question: e.target.value,
                })
              }
            />

          </div>

          {(["A", "B", "C", "D"] as const).map(
            (option) => (
              <div key={option}>

                <Label>
                  Option {option}
                </Label>

                <Input
                  value={
                    edited.options[option]
                  }
                  onChange={(e) =>
                    setEdited({
                      ...edited,
                      options: {
                        ...edited.options,
                        [option]:
                          e.target.value,
                      },
                    })
                  }
                />

              </div>
            )
          )}

          <div>

            <Label>
              Correct Answer
            </Label>

            <Input
              value={
                edited.correct_answer
              }
              onChange={(e) =>
                setEdited({
                  ...edited,
                  correct_answer:
                    e.target.value,
                })
              }
            />

          </div>

          <div className="flex justify-end gap-3">

            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              onClick={() => {
                onSave(edited);
                onClose();
              }}
            >
              Save Changes
            </Button>

          </div>

        </div>

      </DialogContent>
    </Dialog>
  );
}