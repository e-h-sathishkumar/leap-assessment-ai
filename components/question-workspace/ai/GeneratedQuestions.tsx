"use client";

import { useEffect, useState } from "react";

import QuestionToolbar from "./QuestionToolbar";
import QuestionCard, { AIQuestion } from "./QuestionCard";

interface GeneratedQuestionsProps {
  questions: AIQuestion[];

  mode?: "repository" | "assessment";

  onSave?: (questions: AIQuestion[]) => void;

  onAddToTest?: (questions: AIQuestion[]) => void;
}

export default function GeneratedQuestions({
  questions,
  mode = "repository",
  onSave,
  onAddToTest,
}: GeneratedQuestionsProps) {
  const [items, setItems] = useState<AIQuestion[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
useEffect(() => {
  setItems(questions);

  // Automatically select all generated questions
  setSelected(
    questions.map((_, index) => index)
  );
}, [questions]);


  if (items.length === 0) {
    return null;
  }
function toggle(index: number) {
  setSelected((previous) =>
    previous.includes(index)
      ? previous.filter((i) => i !== index)
      : [...previous, index]
  );
}
  function selectAll() {
    setSelected(items.map((_, index) => index));
  }

  function clearSelection() {
    setSelected([]);
  }

  function updateQuestion(
    index: number,
    updatedQuestion: AIQuestion
  ) {
    const updated = [...items];
    updated[index] = updatedQuestion;
    setItems(updated);
  }

  function duplicateQuestion(index: number) {
    const updated = [...items];

    updated.splice(index + 1, 0, {
      ...items[index],
    });

    setItems(updated);
  }

  function deleteQuestion(index: number) {
  if (!confirm("Delete this question?")) {
    return;
  }

  setItems((previous) =>
    previous.filter((_, i) => i !== index)
  );

  setSelected((previous) =>
    previous
      .filter((i) => i !== index)
      .map((i) => (i > index ? i - 1 : i))
  );
}
  const selectedQuestions = items.filter((_, index) =>
    selected.includes(index)
  );
const totalMarks = selectedQuestions.reduce(
  (sum, q) => sum + (q.marks ?? 4),
  0
);

const totalNegativeMarks = selectedQuestions.reduce(
  (sum, q) => sum + (q.negative_marks ?? 1),
  0
);

const estimatedTime = selectedQuestions.length;

const averageDifficulty =
  selectedQuestions.length === 0
    ? "-"
    : selectedQuestions[0].difficulty ?? "Medium";
  return (
    <div className="space-y-6">

      <QuestionToolbar
        total={items.length}  
        selected={selected.length}
        mode={mode}
        onSelectAll={selectAll}
        onClearSelection={clearSelection}
        onSave={() => onSave?.(selectedQuestions)}
        onAddToTest={() => {
  console.log("===== ADD TO TEST =====");
  console.log("Selected:", selectedQuestions.length);
  console.log(selectedQuestions);

  onAddToTest?.(selectedQuestions);
}}
      />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">

  <div className="rounded-xl border bg-white p-5 shadow-sm">
    <p className="text-sm text-slate-500">
      Selected
    </p>

    <p className="mt-2 text-3xl font-bold text-blue-600">
      {selected.length}
    </p>
  </div>

  <div className="rounded-xl border bg-white p-5 shadow-sm">
    <p className="text-sm text-slate-500">
      Total Marks
    </p>

    <p className="mt-2 text-3xl font-bold text-green-600">
      {totalMarks}
    </p>
  </div>

  <div className="rounded-xl border bg-white p-5 shadow-sm">
    <p className="text-sm text-slate-500">
      Negative
    </p>

    <p className="mt-2 text-3xl font-bold text-red-600">
      -{totalNegativeMarks}
    </p>
  </div>

  <div className="rounded-xl border bg-white p-5 shadow-sm">
    <p className="text-sm text-slate-500">
      Estimated Time
    </p>

    <p className="mt-2 text-3xl font-bold">
      {estimatedTime} min
    </p>
  </div>

  <div className="rounded-xl border bg-white p-5 shadow-sm">
    <p className="text-sm text-slate-500">
      Difficulty
    </p>

    <p className="mt-2 text-3xl font-bold">
      {averageDifficulty}
    </p>
  </div>

</div>

      {items.map((question, index) => (
        <div
          key={index}
          className={`rounded-xl border transition ${
            selected.includes(index)
              ? "border-blue-500 bg-blue-50"
              : ""
          }`}
        >
          <div className="flex gap-4 p-4">

            <input
              type="checkbox"
              checked={selected.includes(index)}
              onChange={() => toggle(index)}
              className="mt-2 h-5 w-5"
            />

            <div className="flex-1">

              <QuestionCard
                question={question}
                index={index + 1}
                onUpdate={(updated) =>
                  updateQuestion(index, updated)
                }
                onDuplicate={() =>
                  duplicateQuestion(index)
                }
                onDelete={() =>
                  deleteQuestion(index)
                }
              />

            </div>

          </div>

        </div>
      ))}

    </div>
  );
}