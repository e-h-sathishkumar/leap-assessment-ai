"use client";

import type { QuestionBank } from "@/types/question-bank";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Pencil,
  Trash2,
} from "lucide-react";

interface QuestionTableProps {
  questions: QuestionBank[];
}

export default function QuestionTable({
  questions,
}: QuestionTableProps) {

  if (questions.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center text-slate-500">
        No questions found.
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white shadow-sm">

      <Table>

        <TableHeader>

          <TableRow>

            <TableHead>Question</TableHead>

            <TableHead>Subject</TableHead>

            <TableHead>Chapter</TableHead>

            <TableHead>Difficulty</TableHead>

            <TableHead>Marks</TableHead>

            <TableHead>Status</TableHead>

            <TableHead className="text-right">
              Actions
            </TableHead>

          </TableRow>

        </TableHeader>

        <TableBody>

          {questions.map((question) => (

            <TableRow key={question.id}>

              <TableCell className="max-w-md">

                <p className="line-clamp-2">
                  {question.question_text}
                </p>

              </TableCell>

              <TableCell>
                {question.subjects?.name ?? "-"}
              </TableCell>

              <TableCell>
                {question.chapters?.name ?? "-"}
              </TableCell>

              <TableCell>
                {question.difficulty_levels?.name ?? "-"}
              </TableCell>

              <TableCell>
               {question.marks ?? 0}
              </TableCell>

              <TableCell>

                <Badge>

                  {question.status ?? "Draft"}

                </Badge>

              </TableCell>

              <TableCell className="text-right">

                <div className="flex justify-end gap-2">

                  <Button
  variant="outline"
  size="icon"
  title="Edit Question"
>
  <Pencil className="h-4 w-4" />
</Button>

<Button
  variant="destructive"
  size="icon"
  title="Delete Question"
>
  <Trash2 className="h-4 w-4" />
</Button>

                </div>

              </TableCell>

            </TableRow>

          ))}

        </TableBody>

      </Table>

    </div>
  );
}