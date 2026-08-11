export type ExamPattern =
  | "NEET"
  | "JEE Main"
  | "JEE Advanced"
  | "CBSE";

export type Difficulty =
  | "Easy"
  | "Medium"
  | "Hard"
  | "Mixed";

export type BloomLevel =
  | "Auto"
  | "Remember"
  | "Understand"
  | "Apply"
  | "Analyze"
  | "Evaluate"
  | "Create";

export interface PromptRequest {
  // -----------------------------------------
  // REQUIRED ACADEMIC CONTEXT
  // -----------------------------------------

  exam: ExamPattern;

  className: string;

  subject: string;

  // -----------------------------------------
  // OPTIONAL ACADEMIC PRECISION
  // -----------------------------------------
  //
  // AI can generate without either of these.
  //
  // Empty string means:
  // "Let AI choose appropriate content."
  //

  chapter?: string;

  topic?: string;

  // -----------------------------------------
  // QUESTION CONFIGURATION
  // -----------------------------------------

  questionType: string;

  difficulty: Difficulty;

  bloom: BloomLevel;

  numberOfQuestions: number;

  language: string;

  includeExplanation: boolean;

  includeHint: boolean;

  includeLearningObjective: boolean;

  includeTags: boolean;

  avoidDuplicates: boolean;

  // -----------------------------------------
  // ADDITIONAL TEACHER INSTRUCTIONS
  // -----------------------------------------

  additionalInstructions?: string;
}