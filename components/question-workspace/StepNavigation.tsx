"use client";

interface StepNavigationProps {
  currentStep: number;
  onPrevious: () => void;
  onNext: () => void;
}

export default function StepNavigation({
  currentStep,
  onPrevious,
  onNext,
}: StepNavigationProps) {

  function nextLabel() {
    switch (currentStep) {
      case 1:
        return "Question Creation →";
      case 2:
        return "Create Test →";
      case 3:
        return "Review & Publish →";
      default:
        return "Finish";
    }
  }

  function previousLabel() {
    switch (currentStep) {
      case 2:
        return "← Academic Information";
      case 3:
        return "← Question Creation";
      case 4:
        return "← Create Test";
      default:
        return "← Previous";
    }
  }

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <button
          onClick={onPrevious}
          disabled={currentStep === 1}
          className="rounded-lg border px-6 py-3 font-medium hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {previousLabel()}
        </button>

        <div className="text-center">

          <p className="text-sm text-gray-500">
            Step {currentStep} of 4
          </p>

          <p className="font-semibold">
            {currentStep === 1 &&
              "Academic Information"}

            {currentStep === 2 &&
              "Question Creation"}

            {currentStep === 3 &&
              "Create Test"}

            {currentStep === 4 &&
              "Review & Publish"}
          </p>

        </div>

        <button
          onClick={onNext}
          disabled={currentStep === 4}
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {nextLabel()}
        </button>

      </div>

    </div>
  );
}