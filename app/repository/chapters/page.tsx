"use client";

import { useEffect, useState } from "react";
import { getChapters } from "@/services/chapter.service";
import type { Chapter } from "@/types/chapter";

export default function ChaptersPage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await getChapters();

        console.log("Chapters:", data);

        setChapters(data);
      } catch (error) {
        console.error(error);
      }
    }

    load();
  }, []);

  return (
    <div className="p-8">
      <h1 className="mb-6 text-3xl font-bold">
        Chapters Repository
      </h1>

      {chapters.length === 0 ? (
        <p className="text-slate-500">
          No chapters found.
        </p>
      ) : (
        <table className="w-full border">
          <thead className="bg-slate-100">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Subject ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Code</th>
            </tr>
          </thead>

          <tbody>
            {chapters.map((chapter) => (
              <tr key={chapter.id}>
                <td className="border p-2">{chapter.id}</td>
                <td className="border p-2">{chapter.subject_id}</td>
                <td className="border p-2">{chapter.name}</td>
                <td className="border p-2">{chapter.code}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}