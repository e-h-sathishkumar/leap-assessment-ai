// ====================================================
// File      : test.ts
// Module    : Assessment
// Purpose   : Test Models
// ====================================================

export interface Test {
  id?: number;

  title: string;

  exam: string;

  subject_id: number | null;

  chapter_id: number | null;

  topic_id: number | null;

  duration_minutes: number;

  total_marks: number;

  negative_marks: number;

  instructions?: string;

  status: string;

  start_time?: string | null;

  end_time?: string | null;

  is_active: boolean;

  created_at?: string;

  updated_at?: string;

  description?: string;

  test_type: string;

  question_type: string;

  difficulty: string;

  total_questions: number;

  created_by?: string | null;
}

export interface TestWithSubject extends Test {
  subjects?: {
    id: number;
    name: string;
  };
}

// =========================// ====================================================
// Create Test Form
// ====================================================

export interface CreateTestForm {
  // ------------------------------------------
  // Basic Information
  // ------------------------------------------

  title: string;

  examType: string;

  testType: string;

  academicYear: string;

  classLevel: string;

  language: string;

  description: string;

  // ------------------------------------------
  // Academic Selection (New)
  // ------------------------------------------

  subjectIds: number[];

  chapterIds: number[];

  topicIds: number[];
  subjectNames: string[];

chapterNames: string[];

topicNames: string[];

  // ------------------------------------------
  // Backward Compatibility
  // (Will be removed after migration)
  // ------------------------------------------

  subjectId: number | null;

  chapterId: number | null;

  topicId: number | null;

  // ------------------------------------------
  // Question Configuration
  // ------------------------------------------
questionType: string;
  questionTypes: string[];

  difficultyLevels: string[];

  difficulty: string;

  totalQuestions: number;

  duration: number;

  maximumMarks: number;

  passingMarks: number;

  marksPerQuestion: number;

  negativeMarking: boolean;

  negativeMarks: number;

  // ------------------------------------------
  // Status
  // ------------------------------------------

  status: "Draft" | "Published";

  isActive: boolean;
}