"use client";

interface Props {
  currentStep: number;
}

const steps = [
  "Academic Information",
  "Question Creation",
  "Create Test",
  "Review & Publish",
];

export default function WorkspaceHeader({
  currentStep,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">

      <h1 className="text-3xl font-bold">
        LEAP Assessment AI
      </h1>

      <p className="mt-2 text-sm text-gray-500">
        AI Powered Question Repository & Assessment Builder
      </p>

      <div className="mt-8 flex items-center justify-between">

        {steps.map((step, index) => {
          const stepNo = index + 1;

          const completed = currentStep > stepNo;
          const active = currentStep === stepNo;

          return (
            <div
              key={step}
              className="flex flex-1 items-center last:flex-none"
            >

              <div className="flex flex-col items-center">

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold transition-all
                  ${
                    completed
                      ? "bg-green-600 text-white"
                      : active
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {completed ? "✓" : stepNo}
                </div>

                <span
                  className={`mt-3 text-center text-sm font-medium ${
                    active
                      ? "text-blue-600"
                      : completed
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  {step}
                </span>

              </div>

              {stepNo !== steps.length && (

                <div
                  className={`mx-4 h-1 flex-1 rounded-full transition-all
                  ${
                    completed
                      ? "bg-green-600"
                      : "bg-gray-200"
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