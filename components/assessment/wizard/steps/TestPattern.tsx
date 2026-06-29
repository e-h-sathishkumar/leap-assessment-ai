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

        <div>
          <Label>Total Questions</Label>
          <Input
            type="number"
            value={form.totalQuestions}
            onChange={(e) =>
              setForm({
                ...form,
                totalQuestions: Number(e.target.value),
              })
            }
          />
        </div>

        <div>
          <Label>Maximum Marks</Label>
          <Input
            type="number"
            value={form.maximumMarks}
            onChange={(e) =>
              setForm({
                ...form,
                maximumMarks: Number(e.target.value),
              })
            }
          />
        </div>

        <div>
          <Label>Passing Marks</Label>
          <Input
            type="number"
            value={form.passingMarks}
            onChange={(e) =>
              setForm({
                ...form,
                passingMarks: Number(e.target.value),
              })
            }
          />
        </div>

        <div>
          <Label>Marks Per Question</Label>
          <Input
            type="number"
            value={form.marksPerQuestion}
            onChange={(e) =>
              setForm({
                ...form,
                marksPerQuestion: Number(e.target.value),
              })
            }
          />
        </div>

        <div>
          <Label>Negative Marks</Label>
          <Input
            type="number"
            value={form.negativeMarks}
            onChange={(e) =>
              setForm({
                ...form,
                negativeMarks: Number(e.target.value),
              })
            }
          />
        </div>

      </div>

      <div className="mt-6 flex items-center gap-3">
        <input
          id="negativeMarking"
          type="checkbox"
          checked={form.negativeMarking}
          onChange={(e) =>
            setForm({
              ...form,
              negativeMarking: e.target.checked,
            })
          }
        />

        <Label htmlFor="negativeMarking">
          Enable Negative Marking
        </Label>
      </div>

    </div>
  );
}