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
  questions: unknown[]
) {
  console.log(
    "========== VALIDATOR =========="
  );

  console.log(
    "Received:",
    questions?.length
  );

  console.log(
    questions
  );

  console.log(
    "==============================="
  );

  const valid: AIQuestion[] = [];

  const invalid: unknown[] = [];

  for (
    const question of questions ?? []
  ) {

    if (
      !question ||
      typeof question !== "object"
    ) {
      invalid.push(
        question
      );

      continue;
    }

    const q =
      question as Record<
        string,
        unknown
      >;

    const options =
      q.options as
        | Record<
            string,
            unknown
          >
        | undefined;

    const isValid =
      typeof q.question ===
        "string" &&
      q.question.trim().length > 0 &&

      !!options &&

      typeof options.A ===
        "string" &&
      options.A.trim().length > 0 &&

      typeof options.B ===
        "string" &&
      options.B.trim().length > 0 &&

      typeof options.C ===
        "string" &&
      options.C.trim().length > 0 &&

      typeof options.D ===
        "string" &&
      options.D.trim().length > 0 &&

      typeof q.correct_answer ===
        "string" &&
      q.correct_answer.trim().length > 0;

    if (isValid) {

      valid.push(
        q as unknown as AIQuestion
      );

    } else {

      invalid.push(
        question
      );
    }
  }

  console.log(
    "Valid:",
    valid.length
  );

  console.log(
    "Invalid:",
    invalid.length
  );

  if (
    invalid.length > 0
  ) {
    console.log(
      "========== INVALID QUESTIONS =========="
    );

    console.log(
      invalid
    );

    console.log(
      "========================================"
    );
  }

  return {
    valid,
    invalid,
  };
}