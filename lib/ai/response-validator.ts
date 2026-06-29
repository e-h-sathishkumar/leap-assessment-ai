interface AIQuestion {
  question: string;

  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };

  correct_answer: string;

  explanation?: string;

  hint?: string;

  difficulty?: string;

  bloom_level?: string;

  learning_objective?: string;

  tags?: string[];
}

export function validateQuestions(
  questions: AIQuestion[]
) {
  const valid: AIQuestion[] = [];
  const invalid: AIQuestion[] = [];

  for (const question of questions) {
    const ok =
      question.question &&
      question.options?.A &&
      question.options?.B &&
      question.options?.C &&
      question.options?.D &&
      question.correct_answer;

    if (ok) {
      valid.push(question);
    } else {
      invalid.push(question);
    }
  }

  return {
    valid,
    invalid,
  };
}