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

  const questions =
    attempt?.tests?.test_questions ?? [];

  // =====================================================
  // STATE
  // =====================================================

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [answers, setAnswers] =
    useState<Record<number, string>>({});

  const [visitedQuestions, setVisitedQuestions] =
    useState<Set<number>>(new Set());

  const [reviewQuestions, setReviewQuestions] =
    useState<Set<number>>(new Set());

  const [submitting, setSubmitting] =
    useState(false);

  // =====================================================
  // LOAD SAVED ANSWERS
  // =====================================================

  useEffect(() => {
    async function loadAnswers() {
      try {
        console.log(
          "========================================"
        );

        console.log(
          "LOADING ANSWERS"
        );

        console.log(
          "Attempt ID:",
          attempt.id
        );

        console.log(
          "========================================"
        );

        const saved =
          await getAnswersByAttempt(
            attempt.id
          );

        console.log(
          "Loaded Answers:",
          saved
        );

        const answerMap: Record<
          number,
          string
        > = {};

        const reviewSet =
          new Set<number>();

        saved.forEach(
          (answer: any) => {
            const questionId =
              Number(
                answer.question_id
              );

            if (
              answer.selected_answer
            ) {
              answerMap[
                questionId
              ] =
                answer.selected_answer;
            }

            if (
              answer.marked_for_review
            ) {
              reviewSet.add(
                questionId
              );
            }
          }
        );

        setAnswers(
          answerMap
        );

        setReviewQuestions(
          reviewSet
        );

      } catch (error) {
        console.error(
          "LOAD ANSWERS ERROR:",
          error
        );
      }
    }

    loadAnswers();
  }, [attempt.id]);

  // =====================================================
  // TRACK VISITED QUESTIONS
  // =====================================================

  useEffect(() => {
    if (!questions.length) {
      return;
    }

    const questionId =
      questions[
        currentQuestion
      ]?.questions?.id;

    if (!questionId) {
      return;
    }

    setVisitedQuestions(
      (previous) => {
        const updated =
          new Set(previous);

        updated.add(
          Number(questionId)
        );

        return updated;
      }
    );
  }, [
    currentQuestion,
    questions,
  ]);

  // =====================================================
  // SAVE ANSWER
  // =====================================================

  async function handleSaveAnswer(
    questionId: number,
    selectedAnswer: string
  ) {
    console.log(
      "========================================"
    );

    console.log(
      "SAVE ANSWER"
    );

    console.log(
      "Attempt ID:",
      attempt.id
    );

    console.log(
      "Question ID:",
      questionId
    );

    console.log(
      "Selected Answer:",
      selectedAnswer
    );

    console.log(
      "========================================"
    );

    try {
      const result =
        await saveAnswer(
          attempt.id,
          questionId,
          selectedAnswer
        );

      console.log(
        "Supabase Response:",
        result
      );

      setAnswers(
        (previous) => ({
          ...previous,

          [questionId]:
            selectedAnswer,
        })
      );

    } catch (error) {
      console.error(
        "SAVE ANSWER ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to save answer."
      );
    }
  }

  // =====================================================
  // MARK FOR REVIEW
  // =====================================================

  async function toggleReview(
    questionId: number
  ) {
    const isMarked =
      reviewQuestions.has(
        questionId
      );

    try {
      await markForReview(
        attempt.id,
        questionId,
        !isMarked
      );

      setReviewQuestions(
        (previous) => {
          const updated =
            new Set(previous);

          if (isMarked) {
            updated.delete(
              questionId
            );
          } else {
            updated.add(
              questionId
            );
          }

          return updated;
        }
      );

    } catch (error) {
      console.error(
        "MARK REVIEW ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to update review status."
      );
    }
  }

  // =====================================================
  // CLEAR ANSWER
  // =====================================================

  async function handleClearAnswer(
    questionId: number
  ) {
    try {
      await clearAnswer(
        attempt.id,
        questionId
      );

      setAnswers(
        (previous) => {
          const updated = {
            ...previous,
          };

          delete updated[
            questionId
          ];

          return updated;
        }
      );

    } catch (error) {
      console.error(
        "CLEAR ANSWER ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to clear answer."
      );
    }
  }

  // =====================================================
  // SUBMIT TEST
  // =====================================================

  async function handleSubmitTest() {
    if (submitting) {
      return;
    }

    try {
      setSubmitting(true);

      console.log(
        "========================================"
      );

      console.log(
        "SUBMIT TEST STARTED"
      );

      console.log(
        "Attempt ID:",
        attempt.id
      );

      console.log(
        "Test ID:",
        attempt.tests.id
      );

      console.log(
        "========================================"
      );

      const response =
        await fetch(
          `/api/test-attempts/${attempt.id}/submit`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },
          }
        );

      // =================================================
      // READ RAW RESPONSE
      // =================================================

      const responseText =
        await response.text();

      console.log(
        "SUBMIT HTTP STATUS:",
        response.status
      );

      console.log(
        "SUBMIT RAW RESPONSE:",
        responseText
      );

      // =================================================
      // PARSE RESPONSE
      // =================================================

      let data: any = null;

      try {
        data =
          responseText
            ? JSON.parse(
                responseText
              )
            : null;

      } catch (parseError) {
        console.error(
          "SUBMIT RESPONSE JSON PARSE ERROR:",
          parseError
        );
      }

      console.log(
        "SUBMIT PARSED RESPONSE:",
        data
      );

      // =================================================
      // HANDLE HTTP ERROR
      // =================================================

      if (!response.ok) {
        const apiError =
          data?.details?.message ||
          data?.details?.error_description ||
          data?.message ||
          data?.error ||
          responseText ||
          `Submission failed with HTTP ${response.status}.`;

        console.error(
          "========================================"
        );

        console.error(
          "SUBMIT TEST FAILED"
        );

        console.error(
          "HTTP STATUS:",
          response.status
        );

        console.error(
          "API ERROR CODE:",
          data?.details?.code
        );

        console.error(
          "ACTUAL API ERROR:",
          apiError
        );

        console.error(
          "FULL API RESPONSE:",
          data
        );

        console.error(
          "========================================"
        );

        throw new Error(
          String(apiError)
        );
      }

      // =================================================
      // HANDLE APPLICATION ERROR
      // =================================================

      if (
        data &&
        data.success === false
      ) {
        const apiError =
          data?.details?.message ||
          data?.message ||
          data?.error ||
          "Test submission was not completed.";

        throw new Error(
          String(apiError)
        );
      }

      // =================================================
      // SUCCESS
      // =================================================

      console.log(
        "========================================"
      );

      console.log(
        "TEST SUBMITTED SUCCESSFULLY"
      );

      console.log(
        "SUBMISSION RESULT:",
        data
      );

      console.log(
        "========================================"
      );

      const testId =
        attempt.tests.id;

      const attemptId =
        attempt.id;

      const resultUrl =
        `/online-test/${testId}/result/${attemptId}`;

      console.log(
        "RESULT URL:",
        resultUrl
      );

      router.push(
        resultUrl
      );

    } catch (error) {
      console.error(
        "========================================"
      );

      console.error(
        "FINAL SUBMISSION ERROR"
      );

      console.error(
        error
      );

      console.error(
        "========================================"
      );

      const message =
        error instanceof Error
          ? error.message
          : "Unable to submit the test.";

      alert(message);

      setSubmitting(false);
    }
  }

  // =====================================================
  // NO QUESTIONS
  // =====================================================

  if (!questions.length) {
    return (
      <div className="p-8">
        No questions found.
      </div>
    );
  }

  // =====================================================
  // CURRENT QUESTION
  // =====================================================

  const current =
    questions[
      currentQuestion
    ];

  const currentQuestionId =
    Number(
      current?.questions?.id
    );

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-100">

      {/* =================================================
          HEADER
      ================================================= */}

      <AttemptHeader
        attempt={attempt}
        onTimeUp={
          handleSubmitTest
        }
      />

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="mx-auto max-w-7xl p-6">

        <div className="grid grid-cols-12 gap-6">

          {/* =============================================
              QUESTION AREA
          ============================================= */}

          <div className="col-span-9">

            <QuestionCard
              question={current}

              answer={
                answers[
                  currentQuestionId
                ]
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

          {/* =============================================
              QUESTION PALETTE
          ============================================= */}

          <div className="col-span-3">

            <QuestionPalette
              questions={
                questions
              }

              currentQuestion={
                currentQuestion
              }

              setCurrentQuestion={
                setCurrentQuestion
              }

              answers={
                answers
              }

              visitedQuestions={
                visitedQuestions
              }

              reviewQuestions={
                reviewQuestions
              }
            />

          </div>

        </div>

        {/* ===============================================
            NAVIGATION
        =============================================== */}

        <NavigationBar

          currentQuestion={
            currentQuestion
          }

          totalQuestions={
            questions.length
          }

          onPrevious={() =>
            setCurrentQuestion(
              (previous) =>
                Math.max(
                  0,
                  previous - 1
                )
            )
          }

          onNext={() =>
            setCurrentQuestion(
              (previous) =>
                Math.min(
                  questions.length - 1,
                  previous + 1
                )
            )
          }

          onMarkForReview={() =>
            toggleReview(
              currentQuestionId
            )
          }

          onClearResponse={() =>
            handleClearAnswer(
              currentQuestionId
            )
          }

          onSubmit={
            handleSubmitTest
          }

        />

      </div>

    </div>
  );
}