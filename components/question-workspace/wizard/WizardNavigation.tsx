"use client";

import { Button } from "@/components/ui/button";

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onSave?: () => void;
}

export default function WizardNavigation({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onSave,
}: WizardNavigationProps) {
  return (
    <div className="mt-10 flex justify-between">
      <Button
        variant="outline"
        disabled={currentStep === 0}
        onClick={onPrevious}
      >
        Previous
      </Button>

      {currentStep === totalSteps - 1 ? (
        <Button onClick={onSave}>
          Save Question
        </Button>
      ) : (
        <Button onClick={onNext}>
          Next
        </Button>
      )}
    </div>
  );
}