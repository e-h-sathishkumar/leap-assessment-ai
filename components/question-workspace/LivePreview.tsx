"use client";

interface LivePreviewProps {
  preview: {
    subject: string;
    chapter: string;
    topic: string;
    difficulty: string;
    bloom: string;
    questionType: string;
    marks: string;
  };
}

export default function LivePreview({ preview }: LivePreviewProps) {
  return (
    <div className="sticky top-6">
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Live Preview</h2>

        <div className="mt-4 space-y-4 text-sm">

          <div>
            <p className="text-gray-500">Subject</p>
            <p className="font-medium">{preview.subject || "—"}</p>
          </div>

          <div>
            <p className="text-gray-500">Chapter</p>
            <p className="font-medium">{preview.chapter || "—"}</p>
          </div>

          <div>
            <p className="text-gray-500">Topic</p>
            <p className="font-medium">{preview.topic || "—"}</p>
          </div>

          <div>
            <p className="text-gray-500">Difficulty</p>
            <p className="font-medium">{preview.difficulty || "—"}</p>
          </div>

          <div>
            <p className="text-gray-500">Bloom Level</p>
            <p className="font-medium">{preview.bloom || "—"}</p>
          </div>

          <div>
            <p className="text-gray-500">Question Type</p>
            <p className="font-medium">{preview.questionType || "—"}</p>
          </div>

          <div>
            <p className="text-gray-500">Marks</p>
            <p className="font-medium">{preview.marks || "—"}</p>
          </div>

        </div>
      </div>
    </div>
  );
}