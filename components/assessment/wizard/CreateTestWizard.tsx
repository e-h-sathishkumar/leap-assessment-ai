"use client";

// ====================================================
// Component : CreateTestWizard
// Module    : Assessment
// Purpose   : Main Wizard Engine
// ====================================================

import { useState } from "react";

import type { AIQuestion } from "@/components/question-workspace/ai/QuestionCard";

import PageContainer from "@/components/shared/PageContainer";
import PageHeader from "@/components/shared/PageHeader";

import WizardStepper from "./WizardStepper";
import WizardNavigation from "./WizardNavigation";

import BasicDetails from "./steps/BasicDetails";
//import TestPattern from "./steps/TestPattern";
import ReviewTest from "./steps/ReviewTest";

import AIBuilder from "@/components/assessment/ai-builder/AIBuilder";

import { TOTAL_TEST_WIZARD_STEPS } from "@/utils/test-wizard";

import type { CreateTestForm } from "@/types/test";
import type { Subject } from "@/types/subject";
import type { Chapter } from "@/types/chapter";
import type { Topic } from "@/types/topic";

interface CreateTestWizardProps {
  subjects: Subject[];
  chapters: Chapter[];
  topics: Topic[];
}

export default function CreateTestWizard({
  subjects,
  chapters,
  topics,
}: CreateTestWizardProps) {
  //--------------------------------------------------
  // Wizard State
  //--------------------------------------------------

  const [currentStep, setCurrentStep] =
    useState(0);

  //--------------------------------------------------
  // Selected Questions
  //--------------------------------------------------

  const [testQuestions, setTestQuestions] =
    useState<AIQuestion[]>([]);

  //--------------------------------------------------
  // Form
  //--------------------------------------------------

 const [form, setForm] =
  useState<CreateTestForm>({

    // ======================================
    // Basic Details
    // ======================================

    title: "",

    testType: "Practice",

    examType: "",

    academicYear: "",

    classLevel: "",

    subjectId: null,

    chapterId: null,

    topicId: null,

    language: "English",

    difficulty: "Medium",

    description: "",

    // ======================================
    // Test Settings
    // ======================================

    duration: 180,

    totalQuestions: 180,

    maximumMarks: 720,

    passingMarks: 120,

    marksPerQuestion: 4,

    negativeMarking: true,

    negativeMarks: 1,

    // ======================================
    // Status
    // ======================================

    status: "Draft",

    isActive: true,
  });

  //--------------------------------------------------
  // Navigation
  //--------------------------------------------------

  function nextStep() {
    if (
      currentStep <
      TOTAL_TEST_WIZARD_STEPS - 1
    ) {
      setCurrentStep((prev) => prev + 1);
    }
  }

  function previousStep() {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }

  //--------------------------------------------------
  // Draft
  //--------------------------------------------------

  async function saveDraft() {
  try {
    const response = await fetch("/api/tests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        form,
        questions: testQuestions,
        status: "Draft",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ?? "Failed to save draft."
      );
    }

    alert("✅ Draft saved successfully.");

    console.log(data);

  } catch (error) {
    console.error(error);

    alert(
      error instanceof Error
        ? error.message
        : "Failed to save draft."
    );
  }
}
  //--------------------------------------------------
  // Questions Selected
  //--------------------------------------------------
function handleQuestionsSelected(
  questions: AIQuestion[]
) {
  console.log("===== WIZARD RECEIVED =====");
  console.log(questions.length);
  console.log(questions);

  setTestQuestions(questions);

  setCurrentStep(2);
}
  //--------------------------------------------------
  // Render
  //--------------------------------------------------

  return (
    <PageContainer>

      <PageHeader
        title="Create New Test"
        description="Create and publish AI-powered assessments."
      />

      <WizardStepper
        currentStep={currentStep}
      />

      {/* ------------------------------------ */}
      {/* STEP 1 */}
      {/* ------------------------------------ */}

      {currentStep === 0 && (
        <BasicDetails
          form={form}
          setForm={setForm}
        />
      )}

      {/* ------------------------------------ */}
      {/* STEP 2 */}
      {/* ------------------------------------ */}
{currentStep === 1 && (
  <AIBuilder
    subjects={subjects}
    chapters={chapters}
    topics={topics}
    onQuestionsSelected={
      handleQuestionsSelected
    }
  />
)}
     {/* ------------------------------------ */}
{/* STEP 3 */}
{/* ------------------------------------ */}
{currentStep === 2 && (
  <ReviewTest
    questions={testQuestions}
    form={form}
  />
)}

      {/* ------------------------------------ */}
      {/* Navigation */}
      {/* ------------------------------------ */}

      <WizardNavigation
        currentStep={currentStep}
        totalSteps={
          TOTAL_TEST_WIZARD_STEPS
        }
        onPrevious={previousStep}
        onNext={nextStep}
        onSaveDraft={saveDraft}
      />

    </PageContainer>
  );
}