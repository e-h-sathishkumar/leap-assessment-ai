"use client";

import { Check } from "lucide-react";

interface ProgressStepperProps {
  currentStep: number;
}

const steps = [
  "Academic",
  "Question",
  "Assessment",
  "Review",
];

export default function ProgressStepper({
  currentStep,
}: ProgressStepperProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const completed = index < currentStep;
          const active = index === currentStep;

          return (
            <div
              key={step}
              className="flex flex-1 items-center"
            >
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all
                  ${
                    completed
                      ? "bg-green-600 border-green-600 text-white"
                      : active
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-white border-slate-300 text-slate-400"
                  }`}
                >
                  {completed ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    index + 1
                  )}
                </div>

                <span
                  className={`mt-2 text-sm font-medium
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
                  className={`mx-4 h-1 flex-1 rounded
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

      <div className="mt-6">
        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{
              width: `${((currentStep + 1) / steps.length) * 100}%`,
            }}
          />
        </div>

        <p className="mt-2 text-center text-sm text-slate-500">
          Step {currentStep + 1} of {steps.length}
        </p>
      </div>
    </div>
  );
}