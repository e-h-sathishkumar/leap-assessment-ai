"use client";

// ====================================================
// Component : BasicDetails
// Module    : Assessment Wizard
// Purpose   : Step 1 - Assessment Information
// ====================================================

import type { Dispatch, SetStateAction } from "react";
import FormInput from "@/components/shared/form/FormInput";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { CreateTestForm } from "@/types/test";

interface BasicDetailsProps {
  form: CreateTestForm;
  setForm: Dispatch<SetStateAction<CreateTestForm>>;
}

export default function BasicDetails({
  form,
  setForm,
}: BasicDetailsProps) {
  return (
    <div className="rounded-xl border bg-white p-8 shadow-sm">

      <div className="mb-8">
        <h2 className="text-2xl font-bold">
          Assessment Information
        </h2>

        <p className="mt-2 text-slate-500">
          Provide the general information required before configuring the assessment.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        <FormInput
  label="Assessment Name"
  required
  value={form.title}
  placeholder="NEET Biology Grand Test - 01"
  onChange={(value) =>
    setForm({
      ...form,
      title: value,
    })
  }
/>

        <div className="space-y-2">
          <Label>Exam Type *</Label>

          <select
            value={form.examType}
            onChange={(e) =>
              setForm({
                ...form,
                examType: e.target.value,
              })
            }
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          >
            <option value="">Select Exam</option>
            <option>NEET</option>
            <option>JEE Main</option>
            <option>JEE Advanced</option>
            <option>CBSE</option>
            <option>Olympiad</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label>Academic Year</Label>

          <Input
            value={form.academicYear}
            placeholder="2026-2027"
            onChange={(e) =>
              setForm({
                ...form,
                academicYear: e.target.value,
              })
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Class</Label>

          <Input
            value={form.classLevel}
            placeholder="XI"
            onChange={(e) =>
              setForm({
                ...form,
                classLevel: e.target.value,
              })
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Language</Label>

          <Input
            value={form.language}
            onChange={(e) =>
              setForm({
                ...form,
                language: e.target.value,
              })
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Difficulty</Label>

          <select
            value={form.difficulty}
            onChange={(e) =>
              setForm({
                ...form,
                difficulty: e.target.value,
              })
            }
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>

      </div>

      <div className="mt-6 space-y-2">
        <Label>Description</Label>

        <Textarea
          rows={5}
          value={form.description}
          placeholder="Enter assessment description..."
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
        />
      </div>

    </div>
  );
}