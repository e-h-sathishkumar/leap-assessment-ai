// ======================================================
// LEAP Assessment AI
// Question Mapper
// Converts between AI <-> Repository
// ======================================================

export class QuestionMapper {

  // AI Model -> Database
  static toDatabase(question: any) {
    return {
      subject_id: question.subject_id,
      chapter_id: question.chapter_id,
      topic_id: question.topic_id,

      question: question.question,

      question_type: question.questionType,

      difficulty: question.difficulty,

      marks: question.marks ?? 4,

      negative_marks: question.negative_marks ?? 1,

      option_a: question.options?.[0] ?? "",
      option_b: question.options?.[1] ?? "",
      option_c: question.options?.[2] ?? "",
      option_d: question.options?.[3] ?? "",
      option_e: question.options?.[4] ?? "",

      correct_answer: question.correctAnswer,

      explanation: question.explanation,

      hint: question.hint ?? "",

      learning_objective:
        question.learningObjective ?? "",

      estimated_time_seconds:
        question.estimated_time_seconds ?? 60,

      source_type: question.source_type ?? "AI",

      source_reference:
        question.source_reference ?? "",

      academic_year:
        question.academic_year ?? "",

      generated_by:
        question.generated_by ?? "LEAP AI",

      ai_model:
        question.ai_model ?? "Gemini 2.5 Flash Lite",

      generation_prompt:
        question.generation_prompt ?? "",

      tags: question.tags ?? "",

      keywords: question.keywords ?? "",

      status: question.status ?? "Draft",

      is_active: true,
    };
  }

  // Database -> AI Model
  static fromDatabase(row: any) {
    return {
      id: row.id,

      subject_id: row.subject_id,
      chapter_id: row.chapter_id,
      topic_id: row.topic_id,

      question: row.question,

      questionType: row.question_type,

      difficulty: row.difficulty,

      marks: row.marks,

      negative_marks: row.negative_marks,

      options: [
        row.option_a,
        row.option_b,
        row.option_c,
        row.option_d,
        row.option_e,
      ].filter(Boolean),

      correctAnswer: row.correct_answer,

      explanation: row.explanation,

      hint: row.hint,

      learningObjective:
        row.learning_objective,

      estimated_time_seconds:
        row.estimated_time_seconds,

      source_type: row.source_type,

      source_reference: row.source_reference,

      academic_year: row.academic_year,

      generated_by: row.generated_by,

      ai_model: row.ai_model,

      generation_prompt:
        row.generation_prompt,

      tags: row.tags,

      keywords: row.keywords,

      status: row.status,

      created_at: row.created_at,

      updated_at: row.updated_at,
    };
  }
}