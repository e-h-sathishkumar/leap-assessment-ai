"use server";
console.log(JSON.stringify(request, null, 2));
import crypto from "crypto";

import {
  getSubjectByName,
  getChapterByName,
  getTopicByName,
} from "@/services/subject.service";

import { revalidatePath } from "next/cache";
import {
  createQuestion,
  createQuestions,
  updateQuestion,
  deleteQuestion,
} from "@/services/question-bank.service";


export async function generateQuestionsAction(
  request: PromptRequest
) {
  try {
    const result = await generateQuestions(request);

    const subject = await getSubjectByName(
      request.subject
    );

    const chapter = await getChapterByName(
      subject.id,
      request.chapter
    );

    const topic = await getTopicByName(
      chapter.id,
      request.topic
    );

    const draftId = crypto.randomUUID();

    const dbQuestions = result.valid.map((q: any) => ({
      subject_id: subject.id,
      chapter_id: chapter.id,
      topic_id: topic.id,

      question: q.question,

      question_type: request.questionType,

      difficulty:
        q.difficulty ??
        request.difficulty,

      marks: 4,
      negative_marks: 1,

      explanation:
        q.explanation ?? null,

      hint:
        q.hint ?? null,

      learning_objective:
        q.learning_objective ??
        null,

      is_active: true,

      option_a: q.options.A,
      option_b: q.options.B,
      option_c: q.options.C,
      option_d: q.options.D,
      option_e: null,

      correct_answer:
        q.correct_answer,

      answer_key: null,

      estimated_time_seconds: 90,

      source_type: "AI",
      source_reference: draftId,

      generated_by: "LEAP AI",
      ai_model: "Gemini",

      generation_prompt: null,

      academic_year: null,
      tags: null,
      keywords: null,

      status: "Draft",
    }));

    const savedQuestions =
      await createQuestions(
        dbQuestions
      );

    revalidatePath(
      Routes.repository.questionWorkspace
    );

    return {
      success: true,
      draftId,
      data: savedQuestions,
      invalid: result.invalid,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to generate questions.",
      data: [],
      invalid: [],
    };
  }
}
 {
  try {
    const result = await generateQuestions(request);

    const questions = result.valid.map((q: any) => ({
      ...q,
      status: "Draft",
      generated_by: "LEAP AI",
      source_type: "AI",
    }));

    const savedQuestionsconst dbQuestions = result.valid.map((q: any) => ({
  subject_id: Number(request.subject),
  chapter_id: Number(request.chapter),
  topic_id: Number(request.topic),

  question: q.question,

  option_a: q.options.A,
  option_b: q.options.B,
  option_c: q.options.C,
  option_d: q.options.D,

  correct_answer: q.correct_answer,

  explanation: q.explanation ?? null,
  hint: q.hint ?? null,
  learning_objective: q.learning_objective ?? null,

  question_type: request.questionType,
  difficulty: q.difficulty ?? request.difficulty,

  marks: 4,
  negative_marks: 1,

  is_active: true,

  generated_by: "LEAP AI",
  source_type: "AI",

  status: "Draft",
}));

const savedQuestions = await createQuestions(dbQuestions);

    revalidatePath(
      Routes.repository.questionWorkspace
    );

    return {
      success: true,
      data: savedQuestions,
      invalid: result.invalid,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to generate questions.",
      data: [],
      invalid: [],
    };
  }
}
import type { PromptRequest } from "@/lib/ai/types";

import { Routes } from "@/constants/routes";
import { Messages } from "@/constants/messages";

import {
  getValidatedQuestion,
} from "./mapper";

export async function createQuestionAction(
  formData: FormData
) {
  try {
    const question =
      getValidatedQuestion(formData);

    await createQuestion(question);

    revalidatePath(
      Routes.repository.questionWorkspace
    );

    return {
      success: true,
      message: Messages.question.created,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: Messages.question.createError,
    };
  }
}

export async function updateQuestionAction(
  id: number,
  formData: FormData
) {
  try {
    const question =
      getValidatedQuestion(formData);

    await updateQuestion(
      id,
      question
    );

    revalidatePath(
      Routes.repository.questionWorkspace
    );

    return {
      success: true,
      message: Messages.question.updated,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: Messages.question.updateError,
    };
  }
}

export async function deleteQuestionAction(
  id: number
) {
  try {
    await deleteQuestion(id);

    revalidatePath(
      Routes.repository.questionWorkspace
    );

    return {
      success: true,
      message: Messages.question.deleted,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: Messages.question.deleteError,
    };
  }
}

export async function generateQuestionsAction(
  request: PromptRequest
) {
  try {
    const result =
      await generateQuestions(request);

    return {
      success: true,
      data: result.valid,
      invalid: result.invalid,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to generate questions.",
      data: [],
      invalid: [],
    };
  }
}