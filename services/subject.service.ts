import { supabase } from "@/lib/supabase";
import type { Subject } from "@/types/subject";

export async function getSubjects(): Promise<Subject[]> {
  const { data, error } = await supabase
    .from("subjects")
    .select("*")
    .order("name");

  if (error) {
    console.error("Supabase Error:", error);
    throw new Error(error.message);
  }

  return (data ?? []) as Subject[];
}

export async function createSubject(subject: Subject) {
  const { error } = await supabase
    .from("subjects")
    .insert(subject);

  if (error) throw error;
}

export async function updateSubject(
  id: number,
  subject: Partial<Subject>
) {
  const { error } = await supabase
    .from("subjects")
    .update(subject)
    .eq("id", id);

  if (error) throw error;
}

export async function deleteSubject(id: number) {
  const { error } = await supabase
    .from("subjects")
    .delete()
    .eq("id", id);

  if (error) throw error;
}