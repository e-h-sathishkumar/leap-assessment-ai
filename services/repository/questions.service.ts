import { supabase } from "@/lib/supabase";

export async function saveQuestions(
  questions: any[],
  form: any
) {
  console.log("========== saveQuestions ==========");
  console.log("Questions:", questions.length);

  const payload = questions.map((q) => ({
    // Academic Mapping
    subject_id: form.subjectIds[0],
    chapter_id: form.chapterIds[0],
    topic_id: form.topicIds[0],

    // Question
    question: q.question,

    question_type: q.questionType ?? "MCQ",

    difficulty: q.difficulty ?? "Medium",

    // Marks
    marks: q.marks ?? 4,

    negative_marks: q.negative_marks ?? 1,

    // Options
    option_a: q.options?.A ?? null,

    option_b: q.options?.B ?? null,

    option_c: q.options?.C ?? null,

    option_d: q.options?.D ?? null,

    option_e: q.options?.E ?? null,

    // Answer
    correct_answer: q.correct_answer ?? "A",

    explanation: q.explanation ?? "",

    hint: q.hint ?? null,

    learning_objective:
      q.learning_objective ?? null,

    // Metadata
    status: "Draft",

    source_type: "AI",

    generated_by: "LEAP AI",

    ai_model: "Gemini 2.5 Flash",
  }));

  console.log("========== PAYLOAD ==========");
  console.dir(payload, { depth: null });

  const { data, error } = await supabase
    .from("questions")
    .insert(payload)
    .select();

  if (error) {
    console.error("========== INSERT ERROR ==========");
    console.dir(error, { depth: null });
    throw error;
  }

  console.log("========== QUESTIONS SAVED ==========");
  console.dir(data, { depth: null });

  return data;
}