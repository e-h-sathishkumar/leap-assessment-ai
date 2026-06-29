import { supabase } from "@/lib/supabase";

import type {
  Test,
  TestWithSubject,
} from "@/types/test";

export async function getTests() {
  const { data, error } = await supabase
    .from("tests")
    .select(`
      *,
      subjects(
        id,
        name
      )
    `)
    .order("created_at", {
      ascending: false,
    });

  if (error) throw error;

  return (data ??
    []) as TestWithSubject[];
}

export async function getTestById(
  id: number
) {
  const { data, error } =
    await supabase
      .from("tests")
      .select("*")
      .eq("id", id)
      .single();

  if (error) throw error;

  return data as Test;
}

export async function createTest(
  test: Test
) {
  const { error } = await supabase
    .from("tests")
    .insert(test);

  if (error) throw error;
}

export async function updateTest(
  id: number,
  test: Partial<Test>
) {
  const { error } = await supabase
    .from("tests")
    .update(test)
    .eq("id", id);

  if (error) throw error;
}

export async function deleteTest(
  id: number
) {
  const { error } = await supabase
    .from("tests")
    .delete()
    .eq("id", id);

  if (error) throw error;
}