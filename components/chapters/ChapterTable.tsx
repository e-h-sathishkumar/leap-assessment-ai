import type { Chapter } from "@/types/chapter";
import type { Subject } from "@/types/subject";

import { Badge } from "@/components/ui/badge";

import EditChapterDialog from "./EditChapterDialog";
import DeleteChapterDialog from "./DeleteChapterDialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ChapterTableProps {
  chapters: Chapter[];
  subjects: Subject[];
}

export default function ChapterTable({
  chapters,
  subjects,
}: ChapterTableProps) {
  if (chapters.length === 0) {
    return (
      <div className="rounded-lg border p-6 text-center text-slate-500">
        No chapters found.
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subject</TableHead>
            <TableHead>Chapter</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {chapters.map((chapter) => (
            <TableRow key={chapter.id}>
              <TableCell>
                {chapter.subjects?.name}
              </TableCell>

              <TableCell className="font-medium">
                {chapter.name}
              </TableCell>

              <TableCell>
                <Badge
                  variant={
                    chapter.is_active
                      ? "default"
                      : "secondary"
                  }
                >
                  {chapter.is_active
                    ? "Active"
                    : "Inactive"}
                </Badge>
              </TableCell>

              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <EditChapterDialog
                    chapter={chapter}
                    subjects={subjects}
                  />

                  <DeleteChapterDialog
                    chapter={chapter}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}