import { supabase } from "@/lib/supabase";
export async function getSubjects() {
  const { data, error } = await supabase
    .from("subjects")
    .select("*")
    .order("name");

  if (error) throw error;

  return data;
}

export async function getChapters(subjectId: string) {
  const { data, error } = await supabase
    .from("chapters")
    .select("*")
    .eq("subject_id", subjectId)
    .order("name");

  if (error) throw error;

  return data;
}

export async function getTopics(chapterId: string) {
  console.log("Fetching Topics for Chapter:", chapterId);

  const { data, error } = await supabase
    .from("topics")
    .select("*")
    .eq("chapter_id", chapterId);

  console.log("Topics:", data);
  console.log("Error:", error);

  if (error) throw error;

  return data;
}