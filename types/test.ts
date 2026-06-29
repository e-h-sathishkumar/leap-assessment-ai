export interface Test {
  id: number;

  title: string;

  exam: "NEET" | "JEE Main" | "JEE Advanced" | "CBSE";

  subject_id: number;

  duration_minutes: number;

  total_marks: number;

  negative_marks: number;

  instructions?: string;

  status: "Draft" | "Published" | "Archived";

  start_time?: string | null;

  end_time?: string | null;

  is_active: boolean;

  created_at?: string;

  updated_at?: string;
}

export interface TestWithSubject extends Test {
  subjects?: {
    id: number;
    name: string;
  };
}