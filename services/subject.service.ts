import { supabase } from "@/lib/supabase";
import { Subject } from "@/types/subject";

export async function getSubjects() {
  const { data, error } = await supabase
    .from("subjects")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;

  return data ?? [];
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