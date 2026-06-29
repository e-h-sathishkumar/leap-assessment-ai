// ====================================================
// Component : WizardStepper
// Module    : Assessment
// Purpose   : Displays the Create Test wizard progress.
// ====================================================

import { TEST_WIZARD_STEPS } from "@/utils/test-wizard";

interface WizardStepperProps {
  currentStep: number;
}

export default function WizardStepper({
  currentStep,
}: WizardStepperProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {TEST_WIZARD_STEPS.map((step, index) => {
          const active = index === currentStep;
          const completed = index < currentStep;

          return (
            <div
              key={step}
              className="flex flex-1 items-center"
            >
              <div className="flex flex-col items-center">

                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-300 ${
                    completed
                      ? "border-green-600 bg-green-600 text-white"
                      : active
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-300 bg-white text-slate-500"
                  }`}
                >
                  {completed ? "✓" : index + 1}
                </div>

                <span
                  className={`mt-2 text-center text-xs font-medium ${
                    completed
                      ? "text-green-600"
                      : active
                      ? "text-blue-600"
                      : "text-slate-500"
                  }`}
                >
                  {step}
                </span>

              </div>

              {index < TEST_WIZARD_STEPS.length - 1 && (
                <div
                  className={`mx-3 h-1 flex-1 rounded transition-all duration-300 ${
                    completed
                      ? "bg-green-600"
                      : "bg-slate-200"
                  }`}
                />
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
}
