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
  console.log("========== VALIDATOR ==========");
  console.log("Received:", questions?.length);
  console.log(questions);
  console.log("===============================");

  const valid: AIQuestion[] = [];
  const invalid: AIQuestion[] = [];

  for (const question of questions ?? []) {

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

  console.log("Valid:", valid.length);
  console.log("Invalid:", invalid.length);

  return {
    valid,
    invalid,
  };
}