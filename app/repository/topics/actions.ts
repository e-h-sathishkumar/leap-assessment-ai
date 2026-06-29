"use server";

import { revalidatePath } from "next/cache";

import {
  createTopic,
  updateTopic,
  deleteTopic,
} from "@/services/topic.service";

import { success, failure } from "@/lib/action-response";
import type { ActionResult } from "@/types/action-result";

import { Messages } from "@/constants/messages";
import { Routes } from "@/constants/routes";

export async function createTopicAction(
  formData: FormData
): Promise<ActionResult> {
  try {
    const chapter_id = Number(
      formData.get("chapter_id")
    );

    const name =
      formData.get("name")?.toString().trim() ?? "";

    const description =
      formData.get("description")?.toString().trim() ?? "";

    if (!chapter_id || !name) {
      return failure(Messages.topic.validation);
    }

    await createTopic({
      chapter_id,
      name,
      description,
      is_active: true,
    });

    revalidatePath(Routes.repository.topics);

    return success(Messages.topic.created);
  } catch (error) {
    console.error(error);

    return failure(Messages.topic.createError);
  }
}

export async function updateTopicAction(
  id: number,
  formData: FormData
): Promise<ActionResult> {
  try {
    const chapter_id = Number(
      formData.get("chapter_id")
    );

    const name =
      formData.get("name")?.toString().trim() ?? "";

    const description =
      formData.get("description")?.toString().trim() ?? "";

    if (!chapter_id || !name) {
      return failure(Messages.topic.validation);
    }

    await updateTopic(id, {
      chapter_id,
      name,
      description,
    });

    revalidatePath(Routes.repository.topics);

    return success(Messages.topic.updated);
  } catch (error) {
    console.error(error);

    return failure(Messages.topic.updateError);
  }
}

export async function deleteTopicAction(
  id: number
): Promise<ActionResult> {
  try {
    await deleteTopic(id);

    revalidatePath(Routes.repository.topics);

    return success(Messages.topic.deleted);
  } catch (error) {
    console.error(error);

    return failure(Messages.topic.deleteError);
  }
}