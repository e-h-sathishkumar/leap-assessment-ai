// ============================================================
// LEAP Assessment AI
// Question Workspace Constants
// ============================================================

/**
 * Question workflow status
 */
export const QuestionStatus = [
  "Draft",
  "Review",
  "Approved",
  "Published",
] as const;

/**
 * Question source
 */
export const SourceTypes = [
  "Manual",
  "AI",
  "Imported",
  "Repository",
] as const;

/**
 * AI providers supported by the question workspace
 */
export const AIProviders = [
  "Gemini",
  "OpenAI",
  "Claude",
  "Manual",
] as const;

/**
 * Correct answer options
 */
export const CorrectAnswers = [
  "A",
  "B",
  "C",
  "D",
] as const;

/**
 * Default assessment settings
 */
export const DefaultAssessment = {
  marks: 4,
  negativeMarks: 1,
  estimatedTimeSeconds: 60,
} as const;