// ====================================================
// File      : test-wizard.ts
// Module    : Assessment
// Purpose   : Shared constants for the Create Test Wizard
// ====================================================

export const TEST_WIZARD_STEPS = [
  "Basic Details",
  "Question Builder",
  "Review",
] as const;

export type TestWizardStep =
  typeof TEST_WIZARD_STEPS[number];

export const TOTAL_TEST_WIZARD_STEPS =
  TEST_WIZARD_STEPS.length;
