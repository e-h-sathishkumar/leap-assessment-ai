"use client";

import QuestionCard from "./QuestionCard";

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

interface GeneratedQuestionsProps {
  questions: AIQuestion[];
}

export default function GeneratedQuestions({
  questions,
}: GeneratedQuestionsProps) {
  if (questions.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 space-y-6">

      <h2 className="text-2xl font-bold">
        Generated Questions
      </h2>

      {questions.map((question, index) => (
        <QuestionCard
          key={index}
          question={question}
          index={index + 1}
        />
      ))}

    </div>
  );
}