"use client";

import { useGeneratedQuestions } from "@/hooks/useGeneratedQuestions";

export default function AnswerEditor() {
  const {
    selectedQuestion,
    updateQuestion,
  } = useGeneratedQuestions();

  if (!selectedQuestion) {
    return null;
  }
function updateAnswer(answer: string) {
  if (!selectedQuestion) {
    return;
  }

  updateQuestion({
    ...selectedQuestion,
    id: selectedQuestion.id,
    correctAnswer: answer,
    status: "Edited",
  });
}

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold">
        Correct Answer
      </h2>

      <select
        value={selectedQuestion.correctAnswer ?? ""}
        onChange={(event) =>
          updateAnswer(event.target.value)
        }
        className="w-full rounded-lg border p-3"
      >
        <option value="">
          Select Correct Answer
        </option>

        <option value="A">Option A</option>
        <option value="B">Option B</option>
        <option value="C">Option C</option>
        <option value="D">Option D</option>
      </select>
    </div>
  );
}