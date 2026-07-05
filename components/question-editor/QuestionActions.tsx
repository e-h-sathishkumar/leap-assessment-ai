"use client";

import { useState } from "react";

import {
  saveQuestions,
} from "@/services/repository/question.service";

import { useGeneratedQuestions } from "@/hooks/useGeneratedQuestions";

import CreateTest from "@/components/test-builder/CreateTest";

export default function QuestionActions() {
const {
  questions,
} = useGeneratedQuestions();

  const [saving, setSaving] = useState(false);

  const [saved, setSaved] = useState(false);

  const [showCreateTest, setShowCreateTest] =
    useState(false);

  const [savedQuestions, setSavedQuestions] =
    useState<any[]>([]);

  async function handleSave() {

    if (!questions || questions.length === 0) {

      alert("No questions available.");

      return;

    }

    try {

      setSaving(true);

      const saved = await saveQuestions(
        questions
      );

      setSavedQuestions(saved);

      setSaved(true);

      alert(
        `${saved.length} Questions Saved Successfully`
      );

    } catch (err) {

      console.error(err);

      alert("Unable to save questions.");

    } finally {

      setSaving(false);

    }

  }

  if (questions.length === 0) {
  return null;
}

  return (

    <div className="rounded-xl border bg-white p-6 shadow-sm">

      <div className="flex flex-wrap gap-3">

        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-blue-600 px-6 py-3 text-white"
        >
          {saving
            ? "Saving..."
            : "💾 Save All Questions"}
        </button>

        {saved && (

          <button
            onClick={() =>
              setShowCreateTest(true)
            }
            className="rounded-lg bg-green-600 px-6 py-3 text-white"
          >
            📝 Create Test
          </button>

        )}

      </div>

      {saved && (

        <div className="mt-6 rounded-lg bg-green-50 border border-green-200 p-4">

          <p className="font-semibold text-green-700">

            ✅ {savedQuestions.length} Questions Saved Successfully

          </p>

        </div>

      )}

      {showCreateTest && (

        <CreateTest
          questions={savedQuestions}
        />

      )}

    </div>

  );

}