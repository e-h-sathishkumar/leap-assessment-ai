import { supabase } from "@/lib/supabase";
import { Chapter } from "@/types/chapter";

export async function getChapters() {
  const { data, error } = await supabase
    .from("chapters")
    .select(`
      *,
      subjects (
        id,
        name
      )
    `)
    .order("name", { ascending: true });

  if (error) throw error;

  return data ?? [];
}

export async function getChaptersBySubject(
  subjectId: number
) {
  const { data, error } = await supabase
    .from("chapters")
    .select(`
      *,
      subjects (
        id,
        name
      )
    `)
    .eq("subject_id", subjectId)
    .order("name", { ascending: true });

  if (error) throw error;

  return data ?? [];
}

export async function createChapter(
  chapter: Chapter
) {
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

export async function deleteChapter(
  id: number
) {
  const { error } = await supabase
    .from("chapters")
    .delete()
    .eq("id", id);

  if (error) throw error;
}