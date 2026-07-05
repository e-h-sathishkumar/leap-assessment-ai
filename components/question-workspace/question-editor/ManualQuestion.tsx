"use client";

import { useState } from "react";

export default function ManualQuestion() {
  const [question, setQuestion] = useState("");

  return (
    <div className="space-y-6">

      <div>
        <label className="block mb-2 font-medium">
          Question
        </label>

        <textarea
          rows={6}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your question..."
          className="w-full rounded-lg border p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">

        <div>
          <label className="block mb-2 font-medium">
            Marks
          </label>

          <input
            type="number"
            defaultValue={4}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Negative Marks
          </label>

          <input
            type="number"
            defaultValue={1}
            className="w-full rounded-lg border p-3"
          />
        </div>

      </div>

      <div>
        <label className="block mb-2 font-medium">
          Answer
        </label>

        <textarea
          rows={4}
          placeholder="Enter the correct answer..."
          className="w-full rounded-lg border p-4"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Explanation
        </label>

        <textarea
          rows={5}
          placeholder="Explain the answer..."
          className="w-full rounded-lg border p-4"
        />
      </div>

      <div className="flex justify-end">

        <button
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
        >
          Save Question
        </button>

      </div>

    </div>
  );
}