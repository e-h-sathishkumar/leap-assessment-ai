"use client";

import { useMemo, useState } from "react";

import type { Subject } from "@/types/subject";
import type { TestWithSubject } from "@/types/test";

import AddTestDialog from "./AddTestDialog";

interface TestsClientProps {
  tests: TestWithSubject[];
  subjects: Subject[];
}

export default function TestsClient({
  tests,
  subjects,
}: TestsClientProps) {
  const [search, setSearch] = useState("");

  const filteredTests = useMemo(() => {
    const keyword = search.toLowerCase();

    return tests.filter((test) => {
      return (
        test.title.toLowerCase().includes(keyword) ||
        test.exam.toLowerCase().includes(keyword) ||
        test.subjects?.name
          ?.toLowerCase()
          .includes(keyword) ||
        test.status.toLowerCase().includes(keyword)
      );
    });
  }, [tests, search]);

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            Test Repository
          </h1>

          <p className="mt-1 text-slate-500">
            Create and manage online tests.
          </p>

        </div>

        <AddTestDialog
          subjects={subjects}
        />

      </div>

      {/* Search */}

      <input
        className="w-full rounded-lg border p-3"
        placeholder="Search tests..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      {/* Table */}

      <div className="overflow-hidden rounded-xl border">

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="p-3 text-left">
                Title
              </th>

              <th className="p-3 text-left">
                Exam
              </th>

              <th className="p-3 text-left">
                Subject
              </th>

              <th className="p-3 text-left">
                Duration
              </th>

              <th className="p-3 text-left">
                Marks
              </th>

              <th className="p-3 text-left">
                Status
              </th>

              <th className="p-3 text-right">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredTests.length === 0 ? (

              <tr>

                <td
                  colSpan={7}
                  className="p-10 text-center text-slate-500"
                >
                  No tests found.
                </td>

              </tr>

            ) : (

              filteredTests.map((test) => (

                <tr
                  key={test.id}
                  className="border-t hover:bg-slate-50"
                >

                  <td className="p-3 font-medium">
                    {test.title}
                  </td>

                  <td className="p-3">
                    {test.exam}
                  </td>

                  <td className="p-3">
                    {test.subjects?.name}
                  </td>

                  <td className="p-3">
                    {test.duration_minutes} mins
                  </td>

                  <td className="p-3">
                    {test.total_marks}
                  </td>

                  <td className="p-3">
                    <span className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                      {test.status}
                    </span>
                  </td>

                  <td className="p-3">

                    <div className="flex justify-end gap-2">

                      <button className="rounded border px-3 py-1 text-sm hover:bg-slate-100">
                        Edit
                      </button>

                      <button className="rounded border border-red-300 px-3 py-1 text-sm text-red-600 hover:bg-red-50">
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}