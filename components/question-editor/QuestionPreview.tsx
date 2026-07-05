"use client";

export default function QuestionPreview() {
  return (
    <div className="sticky top-6">

      <div className="rounded-xl border bg-white p-6 shadow-sm">

        <h2 className="mb-6 text-xl font-semibold">
          Live Preview
        </h2>

        <div className="space-y-5">

          <div>
            <p className="text-xs uppercase text-gray-500">
              Subject
            </p>

            <p className="font-medium">
              —
            </p>
          </div>

          <div>
            <p className="text-xs uppercase text-gray-500">
              Chapter
            </p>

            <p className="font-medium">
              —
            </p>
          </div>

          <div>
            <p className="text-xs uppercase text-gray-500">
              Topic
            </p>

            <p className="font-medium">
              —
            </p>
          </div>

          <hr />

          <div>
            <p className="text-xs uppercase text-gray-500">
              Question
            </p>

            <div className="mt-2 rounded-lg bg-gray-50 p-4">
              Question preview will appear here...
            </div>
          </div>

          <hr />

          <div>
            <p className="text-xs uppercase text-gray-500">
              Difficulty
            </p>

            <p className="font-medium">
              —
            </p>
          </div>

          <div>
            <p className="text-xs uppercase text-gray-500">
              Bloom Level
            </p>

            <p className="font-medium">
              —
            </p>
          </div>

          <div>
            <p className="text-xs uppercase text-gray-500">
              Marks
            </p>

            <p className="font-medium">
              —
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}