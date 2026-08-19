"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  // ---------------------------------------
  // Publish Test
  // ---------------------------------------
  async function handlePublish(testId: number) {
    if (!confirm("Publish this test?")) return;

    try {
      const response = await fetch("/api/tests/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          testId,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to publish test."
        );
      }

      alert("✅ Test published successfully.");

      window.location.reload();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to publish test."
      );
    }
  }
// ---------------------------------------
// View Test
// ---------------------------------------
function handleView(testId: number) {
  router.push(`/repository/tests/${testId}`);
}
  // ---------------------------------------
  // Delete Test
  // ---------------------------------------
  
  async function handleDelete(testId: number) {
    if (!confirm("Delete this test?")) return;

    try {
      const response = await fetch("/api/tests", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          testId,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || "Failed to delete test."
        );
      }

      alert("✅ Test deleted successfully.");

      window.location.reload();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete test."
      );
    }
  }

  const filteredTests = useMemo(() => {
    const keyword = search.toLowerCase();
    
    return tests.filter((test) => {
      return (
        test.title.toLowerCase().includes(keyword) ||
        test.exam.toLowerCase().includes(keyword) ||
        test.subjects?.[0]?.name
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

      <AddTestDialog subjects={subjects} />
    </div>

    {/* Search */}
    <input
      className="w-full rounded-lg border p-3"
      placeholder="Search tests..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
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
                    {test.subjects?.[0]?.name}
                  </td>

                  <td className="p-3">
                    {test.duration_minutes} mins
                  </td>

                  <td className="p-3">
                    {test.total_marks}
                  </td>

                  <td className="p-3">
                    <span
                      className={`rounded px-2 py-1 text-xs font-medium ${
                        test.status === "Published"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {test.status}
                    </span>
                  </td>

                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      {test.status === "Draft" && (
                        <button
  onClick={() => handlePublish(test.id!)}
  className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700"
>
  🚀 Publish
</button>
                      )}
<button
  onClick={() => handleView(test.id!)}
  className="rounded border border-blue-300 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50"
>
  👁 View
</button>

                     <button
  onClick={() => handleDelete(test.id!)}
                        className="rounded border border-red-300 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                      >
                        🗑 Delete
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


