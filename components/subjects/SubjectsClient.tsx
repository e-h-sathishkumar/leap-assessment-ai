"use client";

import { useMemo, useState } from "react";

import type { Subject } from "@/types/subject";

import AddSubjectDialog from "./AddSubjectDialog";
import SubjectSearch from "./SubjectSearch";
import SubjectStats from "./SubjectStats";
import SubjectTable from "./SubjectTable";

interface SubjectsClientProps {
  subjects: Subject[];
}

export default function SubjectsClient({
  subjects,
}: SubjectsClientProps) {
  const [search, setSearch] = useState("");

  const filteredSubjects = useMemo(() => {
    const value = search.toLowerCase();

    return subjects.filter(
      (subject) =>
        subject.name.toLowerCase().includes(value) ||
        subject.code.toLowerCase().includes(value)
    );
  }, [subjects, search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Subject Management
          </h1>

          <p className="mt-1 text-slate-500">
            Manage all NEET/JEE subjects
          </p>
        </div>

        <AddSubjectDialog />
      </div>

      {/* Statistics */}
      <SubjectStats subjects={subjects} />

      {/* Search */}
      <SubjectSearch
        value={search}
        onChange={setSearch}
      />

      {/* Table */}
      <SubjectTable
        subjects={filteredSubjects}
      />
    </div>
  );
}