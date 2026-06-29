import { supabase } from "@/lib/supabase";

export async function getSubjects() {
  const { data, error } = await supabase
    .from("subjects")
    .select("*")
    .eq("is_active", true)
    .order("name");

  if (error) throw error;

  return data ?? [];
}

export async function getChapters() {
  const { data, error } = await supabase
    .from("chapters")
    .select("*")
    .eq("is_active", true)
    .order("name");

  if (error) throw error;

  return data ?? [];
}

export async function getTopics() {
  const { data, error } = await supabase
    .from("topics")
    .select("*")
    .eq("is_active", true)
    .order("name");

  if (error) throw error;

  return data ?? [];
}