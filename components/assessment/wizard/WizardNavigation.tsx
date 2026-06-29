// ====================================================
// Component : WizardNavigation
// Module    : Assessment
// Purpose   : Navigation buttons for the Create Test Wizard
// ====================================================

import { Button } from "@/components/ui/button";

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSaveDraft?: () => void;
}

export default function WizardNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSaveDraft,
}: WizardNavigationProps) {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="mt-8 flex items-center justify-between border-t pt-6">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstStep}
      >
        Previous
      </Button>

      <div className="flex gap-3">
        <Button
          variant="secondary"
          onClick={onSaveDraft}
        >
          Save Draft
        </Button>

        <Button onClick={onNext}>
          {isLastStep ? "Publish Test" : "Next"}
        </Button>
      </div>
    </div>
  );
}