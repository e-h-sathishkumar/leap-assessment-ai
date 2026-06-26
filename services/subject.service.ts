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