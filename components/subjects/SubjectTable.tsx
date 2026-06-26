import type { Subject } from "@/types/subject";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SubjectTableProps {
  subjects: Subject[];
}

export default function SubjectTable({
  subjects,
}: SubjectTableProps) {
  if (subjects.length === 0) {
    return (
      <div className="rounded-lg border p-6 text-center text-slate-500">
        No subjects found.
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {subjects.map((subject) => (
            <TableRow key={subject.id}>
              <TableCell className="font-medium">
                {subject.name}
              </TableCell>

              <TableCell>
                {subject.code}
              </TableCell>

              <TableCell>
                <Badge
                  variant={subject.is_active ? "default" : "secondary"}
                >
                  {subject.is_active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}