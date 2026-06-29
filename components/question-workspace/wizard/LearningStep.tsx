"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useQuestion } from "../hooks/useQuestion";

export default function LearningStep() {
  const { question, updateQuestion } =
    useQuestion();

  return (
    <div className="space-y-8">

      <div>

        <h2 className="text-2xl font-semibold">
          Learning Support
        </h2>

        <p className="mt-1 text-slate-500">
          Provide answer key, explanation and
          learning guidance for students.
        </p>

      </div>

      <div className="space-y-6">

        <div>

          <Label>
            Answer Key
          </Label>

          <Textarea
            rows={4}
            value={question.answer_key ?? ""}
            onChange={(e) =>
              updateQuestion({
                answer_key: e.target.value,
              })
            }
            placeholder="Detailed Answer Key..."
          />

        </div>

        <div>

          <Label>
            Explanation
          </Label>

          <Textarea
            rows={5}
            value={question.explanation ?? ""}
            onChange={(e) =>
              updateQuestion({
                explanation: e.target.value,
              })
            }
            placeholder="Explain the concept..."
          />

        </div>

        <div>

          <Label>
            Hint
          </Label>

          <Textarea
            rows={3}
            value={question.hint ?? ""}
            onChange={(e) =>
              updateQuestion({
                hint: e.target.value,
              })
            }
            placeholder="Helpful Hint..."
          />

        </div>

        <div>

          <Label>
            Learning Objective
          </Label>

          <Textarea
            rows={3}
            value={
              question.learning_objective ??
              ""
            }
            onChange={(e) =>
              updateQuestion({
                learning_objective:
                  e.target.value,
              })
            }
            placeholder="What should students learn from this question?"
          />

        </div>

      </div>

    </div>
  );
}