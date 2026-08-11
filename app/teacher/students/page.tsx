"use client";

import { Users } from "lucide-react";

export default function TeacherStudentsPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-6xl">

        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-xl bg-indigo-100 p-3">
            <Users className="h-6 w-6 text-indigo-600" />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Students
            </h1>

            <p className="mt-1 text-slate-600">
              View and manage students from the teacher portal.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Student Management
          </h2>

          <p className="mt-2 text-slate-600">
            Student management features will be available here.
          </p>
        </div>

      </div>
    </div>
  );
}