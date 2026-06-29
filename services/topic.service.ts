import { supabase } from "@/lib/supabase";
import { Topic } from "@/types/topic";

export async function getTopics() {
  const { data, error } = await supabase
    .from("topics")
    .select(`
      *,
      chapters (
        id,
        name,
        subject_id,
        subjects (
          id,
          name
        )
      )
    `)
    .order("name", { ascending: true });

  if (error) throw error;

  return data ?? [];
}

export async function getTopicsByChapter(
  chapterId: number
) {
  const { data, error } = await supabase
    .from("topics")
    .select("*")
    .eq("chapter_id", chapterId)
    .order("name", { ascending: true });

  if (error) throw error;

  return data ?? [];
}

export async function createTopic(
  topic: Topic
) {
  const { error } = await supabase
    .from("topics")
    .insert(topic);

  if (error) throw error;
}

export async function updateTopic(
  id: number,
  topic: Partial<Topic>
) {
  const { error } = await supabase
    .from("topics")
    .update(topic)
    .eq("id", id);

  if (error) throw error;
}

export async function deleteTopic(
  id: number
) {
  const { error } = await supabase
    .from("topics")
    .delete()
    .eq("id", id);

  if (error) throw error;
}