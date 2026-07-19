import { supabase } from "@/lib/supabase";
export async function saveQuestions(
  questions: any[],
  form: any
) {
  const payload = questions.map((q) => ({
subject_id: form.subjectIds?.[0] ?? null,

chapter_id: form.chapterIds?.[0] ?? null,

topic_id: form.topicIds?.[0] ?? null,
    question: q.question,

    question_type: "MCQ",

    difficulty: q.difficulty ?? "Medium",

    marks: q.marks ?? 4,

    negative_marks: q.negative_marks ?? 1,

    option_a: q.options?.A ?? null,

    option_b: q.options?.B ?? null,

    option_c: q.options?.C ?? null,

    option_d: q.options?.D ?? null,

    option_e: null,

    correct_answer: q.correct_answer,

    explanation: q.explanation ?? "",

    hint: q.hint ?? null,

    learning_objective: q.learning_objective ?? null,

    status: "Approved",

    source_type: "AI",

    generated_by: "LEAP AI",

    ai_model: "Gemini",
  }));
  console.log("========== FORM RECEIVED ==========");
console.dir(form, { depth: null });

console.log("SubjectIds:", form.subjectIds);
console.log("ChapterIds:", form.chapterIds);
console.log("TopicIds:", form.topicIds);

  console.log("========== QUESTION PAYLOAD ==========");
console.dir(payload, { depth: null });

  console.log("========== INSERTING QUESTIONS ==========");
console.dir(payload, { depth: null });
console.log("========== QUESTION PAYLOAD ==========");
console.dir(payload, { depth: null });
console.log("========== QUESTION PAYLOAD ==========");
console.dir(payload, { depth: null });

const { data, error } = await supabase
  .from("questions")
  .insert(payload)
  .select();

if (error) {
  console.error("========== QUESTION INSERT ERROR ==========");
  console.dir(error, { depth: null });
  throw error;
}

console.log("========== QUESTIONS SAVED ==========");
console.dir(data, { depth: null });

return data;
}