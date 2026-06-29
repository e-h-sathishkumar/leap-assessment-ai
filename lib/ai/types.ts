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
  exam: ExamPattern;

  subject: string;

  chapter: string;

  topic: string;

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
}