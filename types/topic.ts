export interface Topic {
  id?: number;

  chapter_id: number;

  name: string;
  description?: string;

  is_active?: boolean;

  created_at?: string;
  updated_at?: string;

  chapters?: {
    id: number;
    name: string;
    subject_id: number;

    subjects?: {
      id: number;
      name: string;
    };
  };
}