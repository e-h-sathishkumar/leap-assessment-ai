import { supabase } from "@/lib/supabase";

export async function createTestFromDraft(draftId: string) {
  // Load Draft
  const { data: draft, error: draftError } = await supabase
    .from("question_drafts")
    .select("*")
    .eq("id", draftId)
    .single();

  if (draftError) throw draftError;

  // Create Test
  const { data: test, error: testError } = await supabase
    .from("tests")
    .insert({
      draft_id: draft.id,
      title: draft.title,
      subject_id: draft.subject_id,
      chapter_id: draft.chapter_id,
      topic_id: draft.topic_id,
      total_questions: draft.questions.length,
      status: "Draft",
    })
    .select()
    .single();

  if (testError) throw testError;

  return test;
}