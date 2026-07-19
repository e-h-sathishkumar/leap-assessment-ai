import { supabase } from "@/lib/supabase";

export async function createQuestions(questions: any[]) {
  const { data, error } = await supabase
    .from("questions")
    .insert(questions)
    .select();

  if (error) throw error;

  return data;
}

export async function createQuestion(question: any) {
  const { data, error } = await supabase
    .from("questions")
    .insert(question)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateQuestion(
  id: number,
  question: any
) {
  const { data, error } = await supabase
    .from("questions")
    .update(question)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteQuestion(id: number) {
  const { error } = await supabase
    .from("questions")
    .delete()
    .eq("id", id);

  if (error) throw error;
}