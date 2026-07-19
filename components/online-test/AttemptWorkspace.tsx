"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  saveAnswer,
  getAnswersByAttempt,
  markForReview,
  clearAnswer,
} from "@/services/answer.service";

import AttemptHeader from "./AttemptHeader";
import QuestionCard from "./QuestionCard";
import QuestionPalette from "./QuestionPalette";
import NavigationBar from "./NavigationBar";

interface Props {
  attempt: any;
}

export default function AttemptWorkspace({
  attempt,
}: Props) {
  const router = useRouter();

  const questions = attempt.tests.test_questions ?? [];

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [answers, setAnswers] =
    useState<Record<number, string>>({});

  const [visitedQuestions, setVisitedQuestions] =
    useState<Set<number>>(new Set());

  const [reviewQuestions, setReviewQuestions] =
    useState<Set<number>>(new Set());

  // ----------------------------------------------------
  // Load Saved Answers
  // ----------------------------------------------------

 useEffect(() => {
  async function loadAnswers() {
    try {
      console.log("Loading answers for attempt:", attempt.id);

      const saved = await getAnswersByAttempt(attempt.id);

      console.log("Loaded Answers:", saved);

      const map: Record<number, string> = {};
      const reviewSet = new Set<number>();

      saved.forEach((answer: any) => {
        if (answer.selected_answer) {
          map[answer.question_id] = answer.selected_answer;
        }

        if (answer.marked_for_review) {
          reviewSet.add(answer.question_id);
        }
      });

      setAnswers(map);
      setReviewQuestions(reviewSet);
    } catch (error) {
      console.error("Load Answers Error:", error);
    }
  }

  loadAnswers();
}, [attempt.id]);

  // ----------------------------------------------------
  // Track Visited Questions
  // ----------------------------------------------------

  useEffect(() => {
    if (!questions.length) return;

    const questionId =
      questions[currentQuestion]?.questions?.id;

    if (!questionId) return;

    setVisitedQuestions((prev) => {
      const updated = new Set(prev);
      updated.add(questionId);
      return updated;
    });
  }, [currentQuestion, questions]);



// ----------------------------------------------------
// Save Answer
// ----------------------------------------------------// ----------------------------------------------------
// Save Answer
// ----------------------------------------------------

async function handleSaveAnswer(
  questionId: number,
  selectedAnswer: string
) {
  console.group("SAVE ANSWER");

  console.log("Attempt ID:", attempt.id);
  console.log("Question ID:", questionId);
  console.log("Selected Answer:", selectedAnswer);

  try {
    const result = await saveAnswer(
      attempt.id,
      questionId,
      selectedAnswer
    );

    console.log("Supabase Response:", result);

    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedAnswer,
    }));
  } catch (error) {
    console.error("SAVE FAILED");
    console.error(error);

    if (
      typeof error === "object" &&
      error !== null
    ) {
      console.log(JSON.stringify(error, null, 2));
    }
  }

  console.groupEnd();
}
// ----------------------------------------------------
// Toggle Review
// ----------------------------------------------------

async function toggleReview(
  questionId: number
) {
  const isMarked =
    reviewQuestions.has(questionId);

  try {
    await markForReview(
      attempt.id,
      questionId,
      !isMarked
    );

    setReviewQuestions((prev) => {
      const updated = new Set(prev);

      if (isMarked) {
        updated.delete(questionId);
      } else {
        updated.add(questionId);
      }

      return updated;
    });
  } catch (error) {
    console.error(
      "Failed to mark question for review:",
      error
    );
  }
}
  // ----------------------------------------------------
  // Clear Answer
  // ----------------------------------------------------

  async function handleClearAnswer(
    questionId: number
  ) {
    try {
      await clearAnswer(
        attempt.id,
        questionId
      );

      setAnswers((prev) => {
        const updated = { ...prev };
        delete updated[questionId];
        return updated;
      });
    } catch (error) {
      console.error(
        "Failed to clear answer",
        error
      );
    }
  }

  // ----------------------------------------------------
  // Submit Test
  // ----------------------------------------------------

  async function handleSubmitTest() {
    try {
      const response = await fetch(
        `/api/test-attempts/${attempt.id}/submit`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to submit test."
        );
      }
const testId = attempt.tests.id;

router.push(
  `/online-test/${testId}/result/${attempt.id}`
);

    } catch (error) {
      console.error(error);
      alert("Unable to submit the test.");
    }
  }

  // ----------------------------------------------------

  if (!questions.length) {
    return (
      <div className="p-8">
        No questions found.
      </div>
    );
  }

  const current =
    questions[currentQuestion];

  const currentQuestionId =
    current.questions.id;

  return (
    <div className="min-h-screen bg-slate-100">

      <AttemptHeader
        attempt={attempt}
        onTimeUp={handleSubmitTest}
      />

      <div className="mx-auto max-w-7xl p-6">

        <div className="grid grid-cols-12 gap-6">

          {/* Question */}

          <div className="col-span-9">

            <QuestionCard
              question={current}
              answer={
                answers[currentQuestionId]
              }
              onSaveAnswer={
                handleSaveAnswer
              }
              onClearAnswer={
                handleClearAnswer
              }
              onMarkForReview={
                toggleReview
              }
            />

          </div>

          {/* Palette */}

          <div className="col-span-3">

            <QuestionPalette
              questions={questions}
              currentQuestion={
                currentQuestion
              }
              setCurrentQuestion={
                setCurrentQuestion
              }
              answers={answers}
              visitedQuestions={
                visitedQuestions
              }
              reviewQuestions={
                reviewQuestions
              }
            />

          </div>

        </div>

        {/* Navigation */}

        <NavigationBar
          currentQuestion={
            currentQuestion
          }
          totalQuestions={
            questions.length
          }
          onPrevious={() =>
            setCurrentQuestion((p) =>
              Math.max(0, p - 1)
            )
          }
          onNext={() =>
            setCurrentQuestion((p) =>
              Math.min(
                questions.length - 1,
                p + 1
              )
            )
          }
          onMarkForReview={() =>
            toggleReview(currentQuestionId)
          }
          onClearResponse={() =>
            handleClearAnswer(
              currentQuestionId
            )
          }
          onSubmit={handleSubmitTest}
        />

      </div>

    </div>
  );
}