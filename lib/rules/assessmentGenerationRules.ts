export interface AssessmentGenerationInput {
  exam: string;
  className: string;
  subjects: string[];

  // Optional academic precision filters
  chapters?: string[];
  topics?: string[];

  questionTypes?: string[];
  difficulty?: string;

  numberOfQuestions: number;
  durationMinutes: number;

  additionalInstructions?: string;
}

export interface AssessmentValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateAssessmentGeneration(
  input: AssessmentGenerationInput
): AssessmentValidationResult {
  const errors: string[] = [];

  // -----------------------------------------
  // REQUIRED
  // -----------------------------------------

  if (!input.exam?.trim()) {
    errors.push(
      "Exam / Framework is required."
    );
  }

  if (!input.className?.trim()) {
    errors.push(
      "Class is required."
    );
  }

  if (
    !Array.isArray(input.subjects) ||
    input.subjects.length === 0
  ) {
    errors.push(
      "At least one subject is required."
    );
  }

  if (
    !Number.isFinite(
      input.numberOfQuestions
    ) ||
    input.numberOfQuestions < 1
  ) {
    errors.push(
      "Number of questions must be at least 1."
    );
  }

  if (
    !Number.isFinite(
      input.durationMinutes
    ) ||
    input.durationMinutes < 1
  ) {
    errors.push(
      "Duration must be at least 1 minute."
    );
  }

  // -----------------------------------------
  // OPTIONAL
  // -----------------------------------------
  //
  // chapters and topics are deliberately
  // NOT validated.
  //
  // AI may generate questions using:
  //
  // Exam + Class + Subject
  //
  // and use Chapter / Topic only when
  // the teacher provides them.
  // -----------------------------------------

  return {
    valid: errors.length === 0,
    errors,
  };
}