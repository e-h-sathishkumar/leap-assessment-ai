import { useState } from "react";
import { Button } from "@/components/ui/button";
import GeneratedQuestions from "./GeneratedQuestions";
import type { PromptRequest, Difficulty, ExamPattern } from "@/lib/ai/types";
import type { CreateTestForm } from "@/types/test";

interface AIQuestion {
  question: string;
  options: { A: string; B: string; C: string; D: string; };
  correct_answer: string;
  explanation?: string;
  hint?: string;
  difficulty?: string;
  bloom_level?: string;
  learning_objective?: string;
  tags?: string[];
}

interface AIGeneratorFormProps {
  form: CreateTestForm;
  onAddToTest?: (questions: AIQuestion[]) => void;
}

export default function AIGeneratorForm({ form, onAddToTest }: AIGeneratorFormProps) {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<AIQuestion[]>([]);

  async function handleGenerate() {
    // 1. Validation Checks
    if (form.subjectNames.length === 0 || form.chapterNames.length === 0 || form.topicNames.length === 0) {
      alert("Please ensure subjects, chapters, and topics are selected.");
      return;
    }

    setQuestions([]);
    setLoading(true);

    const request: PromptRequest = {
      exam: form.examType as ExamPattern,
      subject: form.subjectNames.join(", "),
      chapter: form.chapterNames.join(", "),
      topic: form.topicNames.join(", "),
      questionType: form.questionType,
      difficulty: form.difficulty as Difficulty,
      bloom: "Auto",
      numberOfQuestions: form.totalQuestions,
      language: form.language,
      includeExplanation: true,
      includeHint: true,
      includeLearningObjective: true,
      includeTags: true,
      avoidDuplicates: true,
    };

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to generate questions.");
      }

      const validQuestions = data.valid ?? [];
      console.log("========== GENERATED ==========");
console.log(validQuestions.length);
console.log(validQuestions);
console.log("===============================");
      setQuestions(validQuestions);

      if (validQuestions.length === 0) {
        alert("AI could not generate valid questions. Please try again.");
        return;
      }

      onAddToTest?.(validQuestions);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Failed to generate questions.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Configuration Summary Card */}
      <div className="rounded-xl border bg-white p-8 shadow-sm">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">AI Question Generator</h2>
            <p className="text-slate-500 mt-1">
              Review the assessment configuration before generating AI questions.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 rounded-lg border bg-slate-50 p-6">
            <div>
              <p className="text-sm text-slate-500">Exam</p>
              <p className="font-semibold">{form.examType}</p>
            </div>
            <div>
              <p className="text-sm text-sm text-slate-500">Question Type</p>
              <p className="font-semibold">{form.questionType}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Difficulty</p>
              <p className="font-semibold">{form.difficulty}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Questions</p>
              <p className="font-semibold">{form.totalQuestions}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-slate-500">Subjects</p>
              <p className="font-semibold">
                {form.subjectNames.length > 0 ? form.subjectNames.join(", ") : "Not Selected"}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-slate-500">Chapters</p>
              <p className="font-semibold">
                {form.chapterNames.length > 0 ? form.chapterNames.join(", ") : "Not Selected"}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-slate-500">Topics</p>
              <p className="font-semibold">
                {form.topicNames.length > 0 ? form.topicNames.join(", ") : "Not Selected"}
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              onClick={handleGenerate}
              disabled={
                loading ||
                form.subjectNames.length === 0 ||
                form.chapterNames.length === 0 ||
                form.topicNames.length === 0
              }
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Generating AI Questions...
                </>
              ) : (
                "✨ Generate Questions"
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Generated Questions View */}
      <GeneratedQuestions
        questions={questions}
        mode="assessment"
        onAddToTest={onAddToTest}
      />

      {questions.length > 0 && (
        <div className="rounded-lg border bg-green-50 p-4 border-green-200">
          <p className="font-medium text-green-700">
            ✅ {questions.length} AI questions generated successfully.
          </p>
        </div>
      )}
    </div>
  );
}