"use client";

export default function QuestionMetadata() {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-semibold">
        Academic Metadata
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        <div>
          <label className="mb-2 block text-sm font-medium">
            Subject
          </label>

          <select className="w-full rounded-lg border p-3">
            <option>Select Subject</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Chapter
          </label>

          <select className="w-full rounded-lg border p-3">
            <option>Select Chapter</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Topic
          </label>

          <select className="w-full rounded-lg border p-3">
            <option>Select Topic</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Question Type
          </label>

          <select className="w-full rounded-lg border p-3">
            <option>MCQ</option>
            <option>MSQ</option>
            <option>True / False</option>
            <option>Assertion & Reason</option>
            <option>Case Study</option>
            <option>Integer</option>
            <option>Numerical</option>
            <option>Short Answer</option>
            <option>Long Answer</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Difficulty
          </label>

          <select className="w-full rounded-lg border p-3">
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Bloom Level
          </label>

          <select className="w-full rounded-lg border p-3">
            <option>Remember</option>
            <option>Understand</option>
            <option>Apply</option>
            <option>Analyze</option>
            <option>Evaluate</option>
            <option>Create</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Marks
          </label>

          <input
            type="number"
            defaultValue={4}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Negative Marks
          </label>

          <input
            type="number"
            defaultValue={1}
            className="w-full rounded-lg border p-3"
          />
        </div>

      </div>

    </div>
  );
}