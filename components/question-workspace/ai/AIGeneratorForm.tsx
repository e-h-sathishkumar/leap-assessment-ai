"use client";

import { useMemo, useState } from "react"; 

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


import type { Subject } from "@/types/subject";
import type { Chapter } from "@/types/chapter";
import type { Topic } from "@/types/topic";
import EntitySelect from "@/components/common/EntitySelect";
import GeneratedQuestions from "./GeneratedQuestions";

import type {
  Difficulty,
  BloomLevel,
  ExamPattern,
  PromptRequest,
} from "@/lib/ai/types";

interface AIQuestion {
  question: string;

  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };

  correct_answer: string;

  explanation?: string;

  hint?: string;

  difficulty?: string;

  bloom_level?: string;

  learning_objective?: string;

  tags?: string[];
}

interface AIGeneratorFormProps {
  subjects: Subject[];
  chapters: Chapter[];
  topics: Topic[];

  onAddToTest?: (
    questions: AIQuestion[]
  ) => void;
}export default function AIGeneratorForm({
  subjects,
  chapters,
  topics,
  onAddToTest,
}: AIGeneratorFormProps) {
  
  const [loading, setLoading] =
    useState(false);

  const [questions, setQuestions] =
    useState<AIQuestion[]>([]);

  const [request, setRequest] =
    useState<PromptRequest>({
      exam: "NEET",

      subject: "",

      chapter: "",

      topic: "",

      questionType: "MCQ",

      difficulty: "Medium",

      bloom: "Auto",

      numberOfQuestions: 10,

      language: "English",

      includeExplanation: true,

      includeHint: true,

      includeLearningObjective: true,

      includeTags: true,

      avoidDuplicates: true,
    });

  async function handleGenerate() {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/ai/generate",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(request),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ??
            "Failed to generate questions."
        );
      }

      setQuestions(data.valid ?? []);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to generate questions."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">

      <div className="rounded-xl border bg-white p-8 shadow-sm">

        <div className="grid gap-6 md:grid-cols-2">

          <EntitySelect
            label="Exam"
            value={request.exam}
            options={[
              {
                id: "NEET",
                name: "NEET",
              },
              {
                id: "JEE Main",
                name: "JEE Main",
              },
              {
                id: "JEE Advanced",
                name: "JEE Advanced",
              },
              {
                id: "CBSE",
                name: "CBSE",
              },
            ]}
            optionLabel="name"
            optionValue="id"
            onChange={(value) =>
              setRequest({
                ...request,
                exam:
                  value as ExamPattern,
              })
            }
          />

          <div>
            <Label>Subject</Label>

            <Input
              value={request.subject}
              onChange={(e) =>
                setRequest({
                  ...request,
                  subject:
                    e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>Chapter</Label>

            <Input
              value={request.chapter}
              onChange={(e) =>
                setRequest({
                  ...request,
                  chapter:
                    e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>Topic</Label>

            <Input
              value={request.topic}
              onChange={(e) =>
                setRequest({
                  ...request,
                  topic:
                    e.target.value,
                })
              }
            />
          </div>

          <EntitySelect
            label="Difficulty"
            value={
              request.difficulty
            }
            options={[
              {
                id: "Easy",
                name: "Easy",
              },
              {
                id: "Medium",
                name: "Medium",
              },
              {
                id: "Hard",
                name: "Hard",
              },
              {
                id: "Mixed",
                name: "Mixed",
              },
            ]}
            optionLabel="name"
            optionValue="id"
            onChange={(value) =>
              setRequest({
                ...request,
                difficulty:
                  value as Difficulty,
              })
            }
          />

          <EntitySelect
            label="Bloom Level"
            value={request.bloom}
            options={[
              {
                id: "Auto",
                name: "Auto",
              },
              {
                id: "Remember",
                name: "Remember",
              },
              {
                id: "Understand",
                name: "Understand",
              },
              {
                id: "Apply",
                name: "Apply",
              },
              {
                id: "Analyze",
                name: "Analyze",
              },
              {
                id: "Evaluate",
                name: "Evaluate",
              },
              {
                id: "Create",
                name: "Create",
              },
            ]}
            optionLabel="name"
            optionValue="id"
            onChange={(value) =>
              setRequest({
                ...request,
                bloom:
                  value as BloomLevel,
              })
            }
          />

          <div>
            <Label>
              Number of Questions
            </Label>

            <Input
              type="number"
              value={
                request.numberOfQuestions
              }
              onChange={(e) =>
                setRequest({
                  ...request,
                  numberOfQuestions:
                    Number(
                      e.target.value
                    ),
                })
              }
            />
          </div>

        </div>

        <div className="mt-8 flex justify-end">

          <Button
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading
              ? "Generating..."
              : "✨ Generate Questions"}
          </Button>

        </div>

      </div>
<GeneratedQuestions
  questions={questions}
  mode="assessment"
  onAddToTest={onAddToTest}
/>

    </div>
  );
}