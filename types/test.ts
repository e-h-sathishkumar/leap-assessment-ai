// ====================================================
// File      : test.ts
// Module    : Assessment
// Purpose   : Create Test Form Model
// ====================================================

export interface CreateTestForm {
  // Step 1
  title: string;
  examType: string;
  academicYear: string;
  classLevel: string;
  subjectIds: string[];
  language: string;
  difficulty: string;
  description: string;

  // Step 2
  duration: number;
  totalQuestions: number;
  maximumMarks: number;
  passingMarks: number;
  marksPerQuestion: number;
  negativeMarking: boolean;
  negativeMarks: number;
}