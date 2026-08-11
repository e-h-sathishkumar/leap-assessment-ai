"use client";

import { Settings } from "lucide-react";

export default function TeacherSettingsPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-6xl">

        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-xl bg-indigo-100 p-3">
            <Settings className="h-6 w-6 text-indigo-600" />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Teacher Settings
            </h1>

            <p className="mt-1 text-slate-600">
              Manage your teacher portal settings.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

          <h2 className="text-xl font-semibold text-slate-900">
            Settings
          </h2>

          <p className="mt-2 text-slate-600">
            Teacher settings will be available here.
          </p>

        </div>

      </div>
    </div>
  );
}