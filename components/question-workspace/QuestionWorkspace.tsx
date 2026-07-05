"use client";

import { useState } from "react";

import WorkspaceHeader from "./WorkspaceHeader";
import AcademicStep from "./AcademicStep";
import QuestionStep from "./QuestionStep";
import AssessmentStep from "./AssessmentStep";
import ReviewStep from "./ReviewStep";
import StepNavigation from "./StepNavigation";

export default function QuestionWorkspace() {
  const [step, setStep] = useState(1);

  const [preview, setPreview] = useState({
  exam: "NEET",

  subject: "",
  chapter: "",
  topic: "",

  questionType: "MCQ",

  difficulty: "Medium",

  totalQuestions: 10,
});

  return (
    <div className="space-y-6 p-6">

      <WorkspaceHeader currentStep={step} />

      <div>

        {step === 1 && (
          <AcademicStep
            preview={preview}
            setPreview={setPreview}
          />
        )}

        {step === 2 && (
  <QuestionStep
    preview={preview}
  />
)}

        {step === 3 && <AssessmentStep />}

        {step === 4 && <ReviewStep />}

      </div>

      <StepNavigation
        currentStep={step}
        onPrevious={() =>
          setStep((s) => Math.max(1, s - 1))
        }
        onNext={() =>
          setStep((s) => Math.min(4, s + 1))
        }
      />

    </div>
  );
}