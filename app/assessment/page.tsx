"use client";

import PageContainer from "@/components/shared/PageContainer";
import PageHeader from "@/components/shared/PageHeader";
import WizardNavigation from "@/components/assessment/wizard/WizardNavigation";

export default function AssessmentPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Assessment Dashboard"
        description="Wizard Navigation Test"
      />

      <WizardNavigation
        currentStep={0}
        totalSteps={5}
        onPrevious={() => alert("Previous")}
        onNext={() => alert("Next")}
        onSaveDraft={() => alert("Save Draft")}
      />
    </PageContainer>
  );
}