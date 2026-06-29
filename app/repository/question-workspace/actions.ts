"use server";

import { revalidatePath } from "next/cache";

import {
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "@/services/question-bank.service";

import { generateQuestions } from "@/lib/ai/question-generator";
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