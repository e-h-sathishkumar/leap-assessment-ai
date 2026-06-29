"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import EntitySelect from "@/components/common/EntitySelect";

import { CorrectAnswers } from "@/constants/question-workspace";

import { useQuestion } from "../hooks/useQuestion";

export default function QuestionStep() {
  const { question, updateQuestion } =
    useQuestion();

  const answerOptions = CorrectAnswers.map(
    (item) => ({
      id: item,
      name: item,
    })
  );

  return (
    <div className="space-y-8">

      <div>

        <h2 className="text-2xl font-semibold">
          Question Details
        </h2>

        <p className="text-slate-500 mt-1">
          Enter the question and answer
          options.
        </p>

      </div>

      <div className="space-y-6">

        <div>

          <Label>
            Question
          </Label>

          <Textarea
            rows={6}
            value={
              question.question_text ?? ""
            }
            onChange={(e) =>
              updateQuestion({
                question_text:
                  e.target.value,
              })
            }
            placeholder="Enter Question..."
          />

        </div>

        <div>

          <Label>
            Question Image URL
          </Label>

          <Input
            value={
              question.question_image_url ??
              ""
            }
            onChange={(e) =>
              updateQuestion({
                question_image_url:
                  e.target.value,
              })
            }
            placeholder="https://..."
          />

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div>

            <Label>
              Option A
            </Label>

            <Input
              value={
                question.option_a ?? ""
              }
              onChange={(e) =>
                updateQuestion({
                  option_a:
                    e.target.value,
                })
              }
            />

          </div>

          <div>

            <Label>
              Option B
            </Label>

            <Input
              value={
                question.option_b ?? ""
              }
              onChange={(e) =>
                updateQuestion({
                  option_b:
                    e.target.value,
                })
              }
            />

          </div>

          <div>

            <Label>
              Option C
            </Label>

            <Input
              value={
                question.option_c ?? ""
              }
              onChange={(e) =>
                updateQuestion({
                  option_c:
                    e.target.value,
                })
              }
            />

          </div>

          <div>

            <Label>
              Option D
            </Label>

            <Input
              value={
                question.option_d ?? ""
              }
              onChange={(e) =>
                updateQuestion({
                  option_d:
                    e.target.value,
                })
              }
            />

          </div>

        </div>

        <EntitySelect
          label="Correct Answer"
          placeholder="Select Correct Answer"
          value={
            question.correct_answer ?? ""
          }
          options={answerOptions}
          optionLabel="name"
          optionValue="id"
          onChange={(value) =>
            updateQuestion({
              correct_answer:
                value as
                  | "A"
                  | "B"
                  | "C"
                  | "D",
            })
          }
        />

      </div>

    </div>
  );
}