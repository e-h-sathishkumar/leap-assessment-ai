export interface ExamRule {
  name: string;
  code: string;
  minQuestions?: number;
  maxQuestions?: number;
  defaultDuration?: number;
}

const RULES: Record<string, ExamRule> = {
  NEET: {
    name: "NEET",
    code: "NEET",
    minQuestions: 1,
    maxQuestions: 200,
    defaultDuration: 180,
  },

  "JEE Main": {
    name: "JEE Main",
    code: "JEE_MAIN",
    minQuestions: 1,
    maxQuestions: 90,
    defaultDuration: 180,
  },

  "JEE Advanced": {
    name: "JEE Advanced",
    code: "JEE_ADVANCED",
    minQuestions: 1,
    maxQuestions: 60,
    defaultDuration: 180,
  },

  CBSE: {
    name: "CBSE",
    code: "CBSE",
    minQuestions: 1,
    maxQuestions: 100,
    defaultDuration: 180,
  },
};

export function getExamRule(
  exam: string
): ExamRule {
  return (
    RULES[exam] ?? {
      name: exam,
      code: exam,
      minQuestions: 1,
      maxQuestions: 200,
      defaultDuration: 60,
    }
  );
}