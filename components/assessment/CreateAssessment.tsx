"use client";

import { useMemo, useState } from "react";

import {
  createAssessment,
  addQuestionsToAssessment,
} from "@/services/assessment/assessment.service";

interface Preview {
  exam: string;
  subject: string;
  chapter: string;
  topic: string;
  questionType: string;
  difficulty: string;
  totalQuestions: number;
}

interface Props {
  questions: any[];
  preview: Preview;
}

export default function CreateAssessment({
  questions,
  preview,
}: Props) {
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const totalMarks = useMemo(() => {
    return questions.reduce(
      (sum, q) => sum + (q.marks ?? 0),
      0
    );
  }, [questions]);

  const totalNegative = useMemo(() => {
    return questions.reduce(
      (sum, q) => sum + (q.negative_marks ?? 0),
      0
    );
  }, [questions]);

  const duration = questions.length;

  async function handleCreateAssessment() {

    if (!title.trim()) {
      alert("Enter Assessment Title");
      return;
    }

    try {

      setSaving(true);

      const assessment =
        await createAssessment({

          title,

          exam_type: preview.exam,

          subject: preview.subject,

          chapter: preview.chapter,

          topic: preview.topic,

          duration_minutes:
            duration,

          total_marks:
            totalMarks,

          negative_marking:
            totalNegative,

          instructions,

          status: "Draft",

        });

      await addQuestionsToAssessment(
        assessment.id,
        questions
      );

      alert(
        "Assessment Created Successfully."
      );

    } catch (err) {

      console.error(err);

      alert(
        "Unable to create assessment."
      );

    } finally {

      setSaving(false);

    }

  }

  return (

    <div className="rounded-xl border bg-white p-6 shadow-sm">

      <h2 className="text-2xl font-bold">
        Create Assessment
      </h2>

      <div className="mt-6 space-y-5">

        <div>

          <label className="mb-2 block font-medium">
            Assessment Title
          </label>

          <input
            value={title}
            onChange={(e)=>
              setTitle(e.target.value)
            }
            className="w-full rounded-lg border p-3"
          />

        </div>

        <div>

          <label className="mb-2 block font-medium">
            Instructions
          </label>

          <textarea
            rows={4}
            value={instructions}
            onChange={(e)=>
              setInstructions(e.target.value)
            }
            className="w-full rounded-lg border p-3"
          />

        </div>

        <div className="rounded-lg bg-gray-50 p-5">

          <div className="grid grid-cols-2 gap-4">

            <div>
              <strong>Exam</strong>
              <p>{preview.exam}</p>
            </div>

            <div>
              <strong>Subject</strong>
              <p>{preview.subject}</p>
            </div>

            <div>
              <strong>Chapter</strong>
              <p>{preview.chapter}</p>
            </div>

            <div>
              <strong>Topic</strong>
              <p>{preview.topic}</p>
            </div>

            <div>
              <strong>Question Type</strong>
              <p>{preview.questionType}</p>
            </div>

            <div>
              <strong>Difficulty</strong>
              <p>{preview.difficulty}</p>
            </div>

            <div>
              <strong>Total Questions</strong>
              <p>{questions.length}</p>
            </div>

            <div>
              <strong>Total Marks</strong>
              <p>{totalMarks}</p>
            </div>

            <div>
              <strong>Negative Marks</strong>
              <p>-{totalNegative}</p>
            </div>

            <div>
              <strong>Duration</strong>
              <p>{duration} Minutes</p>
            </div>

          </div>

        </div>

        <button
          onClick={handleCreateAssessment}
          disabled={saving}
          className="rounded-lg bg-green-600 px-8 py-3 text-white hover:bg-green-700 disabled:opacity-50"
        >
          {saving
            ? "Creating..."
            : "Create Assessment"}
        </button>

      </div>

    </div>

  );

}