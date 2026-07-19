"use client";

import { useState } from "react";
import { useGeneratedQuestions } from "@/hooks/useGeneratedQuestions";
import { createTestFromDraft } from "@/services/test/create-test.service";

export default function QuestionActions() {
  const { questions } = useGeneratedQuestions();

  const [saving, setSaving] = useState(false);

  async function handleCreateTest() {
    if (!questions || questions.length === 0) {
      alert("No questions available.");
      return;
    }

    try {
      setSaving(true);

      // Replace this with the real draft/session id later
      const draftId = "TEMP_DRAFT";

      const test = await createTestFromDraft(draftId);

      window.location.href = `/assessment/tests/${test.id}`;
    } catch (error) {
      console.error(error);
      alert("Unable to create test.");
    } finally {
      setSaving(false);
    }
  }

  if (!questions || questions.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <button
        onClick={handleCreateTest}
        disabled={saving}
        className="rounded-lg bg-blue-600 px-6 py-3 text-white"
      >
        {saving ? "Creating Test..." : "🚀 Create Test"}
      </button>
    </div>
  );
}