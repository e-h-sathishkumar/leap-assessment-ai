"use client";

import type { Topic } from "@/types/topic";
import type { Subject } from "@/types/subject";
import type { Chapter } from "@/types/chapter";

import { Badge } from "@/components/ui/badge";

import EditTopicDialog from "./EditTopicDialog";
import DeleteTopicDialog from "./DeleteTopicDialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TopicTableProps {
  topics: Topic[];
  subjects: Subject[];
  chapters: Chapter[];
}

export default function TopicTable({
  topics,
  subjects,
  chapters,
}: TopicTableProps) {
  if (topics.length === 0) {
    return (
      <div className="rounded-lg border p-6 text-center text-slate-500">
        No topics found.
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white shadow-sm overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subject</TableHead>
            <TableHead>Chapter</TableHead>
            <TableHead>Topic</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {topics.map((topic) => (
            <TableRow key={topic.id}>
              <TableCell>
                {topic.chapters?.subjects?.name ?? "-"}
              </TableCell>

              <TableCell>
                {topic.chapters?.name ?? "-"}
              </TableCell>

              <TableCell className="font-medium">
                {topic.name}
              </TableCell>

              <TableCell>
                <Badge
                  variant={
                    topic.is_active
                      ? "default"
                      : "secondary"
                  }
                >
                  {topic.is_active
                    ? "Active"
                    : "Inactive"}
                </Badge>
              </TableCell>

              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <EditTopicDialog
                    topic={topic}
                    subjects={subjects}
                    chapters={chapters}
                  />

                  <DeleteTopicDialog
                    topic={topic}
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