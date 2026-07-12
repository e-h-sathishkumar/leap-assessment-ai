"use client";

// ====================================================
// Component : TestPattern
// Module    : Assessment Wizard
// Purpose   : Step 2 - Configure Test Pattern
// ====================================================

import type { Dispatch, SetStateAction } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { CreateTestForm } from "@/types/test";

interface TestPatternProps {
  form: CreateTestForm;
  setForm: Dispatch<SetStateAction<CreateTestForm>>;
}

export default function TestPattern({
  form,
  setForm,
}: TestPatternProps) {
  const calculatedMarks =
    form.totalQuestions * form.marksPerQuestion;

  return (
    <div className="rounded-xl border bg-white p-8 shadow-sm">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">
          Test Pattern
        </h2>

        <p className="mt-2 text-slate-500">
          Configure the test pattern and marking scheme.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        {/* Duration */}

        <div>
          <Label>Duration (Minutes)</Label>

          <Input
            type="number"
            value={form.duration}
            onChange={(e) =>
              setForm({
                ...form,
                duration: Number(e.target.value),
              })
            }
          />
        </div>

        {/* Total Questions */}

        <div>
          <Label>Total Questions</Label>

          <Input
            type="number"
            value={form.totalQuestions}
            onChange={(e) => {
              const totalQuestions = Number(
                e.target.value
              );

              setForm({
                ...form,
                totalQuestions,
                maximumMarks:
                  totalQuestions *
                  form.marksPerQuestion,
              });
            }}
          />
        </div>

        {/* Maximum Marks */}

        <div>
          <Label>Maximum Marks</Label>

          <Input
            type="number"
            value={calculatedMarks}
            readOnly
            className="bg-slate-100"
          />
        </div>

        {/* Passing Marks */}

        <div>
          <Label>Passing Marks</Label>

          <Input
            type="number"
            value={form.passingMarks}
            onChange={(e) =>
              setForm({
                ...form,
                passingMarks: Number(
                  e.target.value
                ),
              })
            }
          />
        </div>

        {/* Marks Per Question */}

        <div>
          <Label>Marks Per Question</Label>

          <Input
            type="number"
            value={form.marksPerQuestion}
            onChange={(e) => {
              const marksPerQuestion =
                Number(e.target.value);

              setForm({
                ...form,
                marksPerQuestion,
                maximumMarks:
                  form.totalQuestions *
                  marksPerQuestion,
              });
            }}
          />
        </div>

        {/* Negative Marks */}

        <div>
          <Label>Negative Marks</Label>

          <Input
            type="number"
            disabled={!form.negativeMarking}
            value={form.negativeMarks}
            onChange={(e) =>
              setForm({
                ...form,
                negativeMarks: Number(
                  e.target.value
                ),
              })
            }
          />
        </div>
      </div>

      {/* Negative Marking */}

      <div className="mt-6 flex items-center gap-3">
        <input
          id="negativeMarking"
          type="checkbox"
          checked={form.negativeMarking}
          onChange={(e) =>
            setForm({
              ...form,
              negativeMarking:
                e.target.checked,
            })
          }
        />

        <Label htmlFor="negativeMarking">
          Enable Negative Marking
        </Label>
      </div>

      {/* Test Summary */}

      <div className="mt-8 rounded-xl border bg-blue-50 p-6">
        <h3 className="text-lg font-semibold">
          Test Summary
        </h3>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <p>
            <strong>Questions:</strong>{" "}
            {form.totalQuestions}
          </p>

          <p>
            <strong>Duration:</strong>{" "}
            {form.duration} Minutes
          </p>

          <p>
            <strong>Marks / Question:</strong>{" "}
            {form.marksPerQuestion}
          </p>

          <p>
            <strong>Total Marks:</strong>{" "}
            {calculatedMarks}
          </p>

          <p>
            <strong>Negative Mark:</strong>{" "}
            {form.negativeMarking
              ? form.negativeMarks
              : "Disabled"}
          </p>
        </div>
      </div>
    </div>
  );
}