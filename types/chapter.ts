export interface Chapter {
  id?: number;
  subject_id: number;
  name: string;
  code?: string | null;
  description?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}