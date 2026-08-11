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
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
        No chapters found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <Table>

        <TableHeader>
          <TableRow>
            <TableHead>
              Subject
            </TableHead>

            <TableHead>
              Chapter
            </TableHead>

            <TableHead>
              Status
            </TableHead>

            <TableHead className="text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {chapters.map(
            (chapter) => {
              const subject =
                subjects.find(
                  (item) =>
                    item.id ===
                    chapter.subject_id
                );

              return (
                <TableRow
                  key={chapter.id}
                >

                  {/* SUBJECT */}

                  <TableCell>
                    {subject?.name ??
                      "Unknown Subject"}
                  </TableCell>

                  {/* CHAPTER */}

                  <TableCell className="font-medium">
                    {chapter.name}
                  </TableCell>

                  {/* STATUS */}

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

                  {/* ACTIONS */}

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
              );
            }
          )}
        </TableBody>

      </Table>
    </div>
  );
}