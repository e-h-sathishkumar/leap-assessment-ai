"use client";

import type { QuestionBank } from "@/types/question-bank";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface QuestionPreviewProps {
  question: Partial<QuestionBank>;
}

export default function QuestionPreview({
  question,
}: QuestionPreviewProps) {
  return (
    <Card className="sticky top-4">
      <CardContent className="space-y-5 pt-6">

        <div>
          <h2 className="text-xl font-bold">
            Live Preview
          </h2>

          <p className="text-sm text-slate-500">
            Preview before saving
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Badge>
            {question.status ?? "Draft"}
          </Badge>

          <Badge variant="secondary">
            {question.marks ?? 4} Marks
          </Badge>
        </div>

        <div>
          <h3 className="font-semibold mb-2">
            Question
          </h3>

          <p className="text-slate-700 whitespace-pre-wrap">
            {question.question_text ||
              "Question will appear here..."}
          </p>
        </div>

        <div className="space-y-2">

          {question.option_a && (
            <div>A. {question.option_a}</div>
          )}

          {question.option_b && (
            <div>B. {question.option_b}</div>
          )}

          {question.option_c && (
            <div>C. {question.option_c}</div>
          )}

          {question.option_d && (
            <div>D. {question.option_d}</div>
          )}

          {question.option_e && (
            <div>E. {question.option_e}</div>
          )}

        </div>

        <div>
          <span className="font-semibold">
            Correct Answer :
          </span>{" "}
          {question.correct_answer ?? "-"}
        </div>

        {question.explanation && (
          <div>
            <h3 className="font-semibold mb-2">
              Explanation
            </h3>

            <p className="text-sm text-slate-600">
              {question.explanation}
            </p>
          </div>
        )}

      </CardContent>
    </Card>
  );
}