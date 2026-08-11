"use client";

export default function AssessmentLibraryPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            Assessment Library
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Saved assessments will appear here.
          </p>

          <div className="mt-8 rounded-xl border border-dashed border-slate-300 p-8 text-center">
            <p className="text-sm text-slate-500">
              No saved assessments to display yet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}