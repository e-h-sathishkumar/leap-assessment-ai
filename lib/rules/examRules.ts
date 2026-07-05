export interface ExamRule {
  marks: number;
  negativeMarks: number;
  suggestedTimePerQuestion: number;
}

export const ExamRules: Record<
  string,
  Record<string, ExamRule>
> = {
  NEET: {
    MCQ: {
      marks: 4,
      negativeMarks: 1,
      suggestedTimePerQuestion: 1,
    },
  },

  "JEE Main": {
    MCQ: {
      marks: 4,
      negativeMarks: 1,
      suggestedTimePerQuestion: 2,
    },

    Integer: {
      marks: 4,
      negativeMarks: 0,
      suggestedTimePerQuestion: 2,
    },
  },

  CBSE: {
    MCQ: {
      marks: 1,
      negativeMarks: 0,
      suggestedTimePerQuestion: 1,
    },

    "Very Short": {
      marks: 2,
      negativeMarks: 0,
      suggestedTimePerQuestion: 2,
    },

    "Short Answer": {
      marks: 3,
      negativeMarks: 0,
      suggestedTimePerQuestion: 4,
    },

    "Long Answer": {
      marks: 5,
      negativeMarks: 0,
      suggestedTimePerQuestion: 8,
    },
  },
};

export function getExamRule(
  exam: string,
  questionType: string
): ExamRule {
  return (
    ExamRules?.[exam]?.[questionType] ?? {
      marks: 1,
      negativeMarks: 0,
      suggestedTimePerQuestion: 1,
    }
  );
}