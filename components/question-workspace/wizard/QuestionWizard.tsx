"use client";

import { useState } from "react";

import { QuestionProvider } from "../context/QuestionProvider";
import { useQuestion } from "../hooks/useQuestion";

import AcademicStep from "./AcademicStep";
import QuestionStep from "./QuestionStep";
import LearningStep from "./LearningStep";
import AssessmentStep from "./AssessmentStep";
import ReviewStep from "./ReviewStep";

import ProgressStepper from "./ProgressStepper";
import WizardNavigation from "./WizardNavigation";

import QuestionPreview from "../preview/QuestionPreview";

function WizardContent() {
  const [currentStep, setCurrentStep] =
    useState(0);

  const { question } = useQuestion();

  const totalSteps = 5;

  function nextStep() {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((previous) => previous + 1);
    }
  }

  function previousStep() {
    if (currentStep > 0) {
      setCurrentStep((previous) => previous - 1);
    }
  }

  function saveQuestion() {
    console.log("Save Question", question);

    // We will connect this
    // to Supabase next.
  }

  return (
    <div className="space-y-8">

      <ProgressStepper
        currentStep={currentStep}
      />

      <div className="grid gap-8 lg:grid-cols-3">

        <div className="lg:col-span-2">

          <div className="rounded-xl border bg-white p-6 shadow-sm">

            {currentStep === 0 && (
              <AcademicStep />
            )}

            {currentStep === 1 && (
              <QuestionStep />
            )}

            {currentStep === 2 && (
              <LearningStep />
            )}

            {currentStep === 3 && (
              <AssessmentStep />
            )}

            {currentStep === 4 && (
              <ReviewStep />
            )}

          </div>

          <WizardNavigation
            currentStep={currentStep}
            totalSteps={totalSteps}
            onNext={nextStep}
            onPrevious={previousStep}
            onSave={saveQuestion}
          />

        </div>

        <div>

          <QuestionPreview
            question={question}
          />

        </div>

      </div>

    </div>
  );
}

export default function QuestionWizard() {
  return (
    <QuestionProvider>
      <WizardContent />
    </QuestionProvider>
  );
}