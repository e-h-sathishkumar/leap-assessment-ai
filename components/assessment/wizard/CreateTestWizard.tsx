"use client";

// ====================================================
// Component : CreateTestWizard
// Module    : Assessment
// Purpose   : Main Wizard Engine
// ====================================================
<WizardStepper currentStep={currentStep} />

import { useState } from "react";
import TestPattern from "./steps/TestPattern";
import PageContainer from "@/components/shared/PageContainer";
import PageHeader from "@/components/shared/PageHeader";

import WizardStepper from "./WizardStepper";
import WizardNavigation from "./WizardNavigation";
import BasicDetails from "./steps/BasicDetails";

import { TOTAL_TEST_WIZARD_STEPS } from "@/utils/test-wizard";
import type { CreateTestForm } from "@/types/test";

export default function CreateTestWizard() {
  const [currentStep, setCurrentStep] = useState(0);

const [form, setForm] = useState<CreateTestForm>({
  title: "",
  examType: "",
  academicYear: "",
  classLevel: "",
  subjectIds: [],
  language: "English",
  difficulty: "Medium",
  description: "",

  duration: 180,
  totalQuestions: 180,
  maximumMarks: 720,
  passingMarks: 120,
  marksPerQuestion: 4,
  negativeMarking: true,
  negativeMarks: 1,
});

 function nextStep() {
  if (currentStep < TOTAL_TEST_WIZARD_STEPS - 1) {
    setCurrentStep((prev) => prev + 1);
  }
}

  function previousStep() {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }

  function saveDraft() {
    console.log(form);
  }

  return (
    <PageContainer>
      <PageHeader
        title="Create New Test"
        description="Create and publish AI-powered assessments."
      />

      <WizardStepper currentStep={currentStep} />

    {currentStep === 0 && (
  <BasicDetails
    form={form}
    setForm={setForm}
  />
)}

{currentStep === 1 && (
  <TestPattern
    form={form}
    setForm={setForm}
  />
)}


      <WizardNavigation
        currentStep={currentStep}
        totalSteps={TOTAL_TEST_WIZARD_STEPS}
        onPrevious={previousStep}
        onNext={nextStep}
        onSaveDraft={saveDraft}
      />
    </PageContainer>
  );
}