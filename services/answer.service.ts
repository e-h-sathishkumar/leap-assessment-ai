import { supabase } from "@/lib/supabase";

// -----------------------------------------------------
// Save / Update Answer
// -----------------------------------------------------

export async function saveAnswer(
  attemptId: number,
  questionId: number,
  selectedAnswer: string,
  timeSpentSeconds = 0,
  markedForReview = false
) {
  const payload = {
    attempt_id: attemptId,
    question_id: questionId,
    selected_answer: selectedAnswer,
    time_spent_seconds: timeSpentSeconds,
    marked_for_review: markedForReview,
    answered_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("student_answers")
    .upsert(payload, {
      onConflict: "attempt_id,question_id",
    })
    .select()
    .single();

  if (error) {
    console.group("SUPABASE SAVE ANSWER");
    console.error("Payload:", payload);
    console.error("Code:", error.code);
    console.error("Message:", error.message);
    console.error("Details:", error.details);
    console.error("Hint:", error.hint);
    console.groupEnd();

    throw error;
  }

  console.log("Answer Saved:", data);

  return data;
}

// -----------------------------------------------------
// Load Answers
// -----------------------------------------------------

export async function getAnswersByAttempt(
  attemptId: number
) {
  const { data, error } = await supabase
    .from("student_answers")
    .select("*")
    .eq("attempt_id", attemptId)
    .order("question_id");

  if (error) {
    console.error(error);
    throw error;
  }

  return data ?? [];
}

// -----------------------------------------------------
// Mark For Review
// -----------------------------------------------------

export async function markForReview(
  attemptId: number,
  questionId: number,
  review: boolean
) {
  const { data: existing } = await supabase
    .from("student_answers")
    .select("id")
    .eq("attempt_id", attemptId)
    .eq("question_id", questionId)
    .maybeSingle();

  if (!existing) {
    const { error } = await supabase
      .from("student_answers")
      .insert({
        attempt_id: attemptId,
        question_id: questionId,
        marked_for_review: review,
      });

    if (error) throw error;

    return;
  }

  const { error } = await supabase
    .from("student_answers")
    .update({
      marked_for_review: review,
    })
    .eq("attempt_id", attemptId)
    .eq("question_id", questionId);

  if (error) throw error;
}

// -----------------------------------------------------
// Clear Response
// -----------------------------------------------------

export async function clearAnswer(
  attemptId: number,
  questionId: number
) {
  const { error } = await supabase
    .from("student_answers")
    .update({
      selected_answer: null,
      answered_at: null,
    })
    .eq("attempt_id", attemptId)
    .eq("question_id", questionId);

  if (error) throw error;
}