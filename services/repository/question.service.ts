export async function saveQuestions(questions: any[]) {

  const payload = questions.map((q) => ({

    subject_id: q.subject_id ?? null,

    chapter_id: q.chapter_id ?? null,

    topic_id: q.topic_id ?? null,

    question: q.question,

    question_type: q.questionType ?? "MCQ",

    difficulty: q.difficulty ?? "Medium",

    marks: q.marks ?? 4,

    negative_marks: q.negative_marks ?? 1,

    option_a: q.options?.[0] ?? null,

    option_b: q.options?.[1] ?? null,

    option_c: q.options?.[2] ?? null,

    option_d: q.options?.[3] ?? null,

    option_e: q.options?.[4] ?? null,

    correct_answer: q.correctAnswer ?? "A",

    explanation: q.explanation ?? "",

    hint: q.hint ?? null,

    learning_objective:
      q.learningObjective ?? null,

    status: q.status ?? "Draft",

    source_type: "AI",

    generated_by: "LEAP AI",

    ai_model: "Gemini",

  }));

  const { data, error } = await supabase
    .from("questions")
    .insert(payload)
    .select();

  if (error) throw error;

  return data;
}