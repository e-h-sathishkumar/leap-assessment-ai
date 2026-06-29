// ====================================================
// Component : WizardStepper
// Module    : Assessment
// Purpose   : Displays the Create Test wizard progress.
// ====================================================

interface WizardStepperProps {
  steps: string[];
  currentStep: number;
}

export default function WizardStepper({
  steps,
  currentStep,
}: WizardStepperProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const active = index === currentStep;
          const completed = index < currentStep;

          return (
            <div
              key={step}
              className="flex flex-1 items-center"
            >
              <div className="flex flex-col items-center">

                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all
                  ${
                    completed
                      ? "border-green-600 bg-green-600 text-white"
                      : active
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-300 bg-white text-slate-500"
                  }`}
                >
                  {index + 1}
                </div>

                <span
                  className={`mt-2 text-xs text-center font-medium
                  ${
                    active
                      ? "text-blue-600"
                      : completed
                      ? "text-green-600"
                      : "text-slate-500"
                  }`}
                >
                  {step}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`mx-3 h-1 flex-1 rounded
                  ${
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