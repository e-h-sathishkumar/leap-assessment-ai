import { supabase } from "@/lib/supabase";
import type { Chapter } from "@/types/chapter";

export async function getChapters(subjectId?: number): Promise<Chapter[]> {
  let query = supabase
    .from("chapters")
    .select("*")
    .order("name", { ascending: true });

  if (subjectId) {
    query = query.eq("subject_id", subjectId);
  }

  const { data, error } = await query;

  if (error) throw error;

  return (data ?? []) as Chapter[];
}

export async function createChapter(chapter: Chapter) {
  const { error } = await supabase
    .from("chapters")
    .insert(chapter);

  if (error) throw error;
}

export async function updateChapter(
  id: number,
  chapter: Partial<Chapter>
) {
  const { error } = await supabase
    .from("chapters")
    .update(chapter)
    .eq("id", id);

  if (error) throw error;
}

export async function deleteChapter(id: number) {
  const { error } = await supabase
    .from("chapters")
    .delete()
    .eq("id", id);

  if (error) throw error;
}