"use client";

import { useEffect, useState } from "react";

import { getSubjects } from "@/services/subject.service";

import type { Subject } from "@/types/subject";

export default function SubjectFilter() {
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getSubjects();
      setSubjects(data);
    }

    load();
  }, []);

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">
        Subject
      </h3>

      <select className="w-full rounded-md border px-3 py-2">
        <option>Select Subject</option>

        {subjects.map((subject) => (
          <option
            key={subject.id}
            value={subject.id}
          >
            {subject.name}
          </option>
        ))}
      </select>
    </div>
  );
}