"use server";

import { revalidatePath } from "next/cache";

import {
  createChapter,
  updateChapter,
  deleteChapter,
} from "@/services/chapter.service";

import { success, failure } from "@/lib/action-response";
import type { ActionResult } from "@/types/action-result";

import { Messages } from "@/constants/messages";
import { Routes } from "@/constants/routes";

export async function createChapterAction(
  formData: FormData
): Promise<ActionResult> {
  try {
    const subject_id = Number(
      formData.get("subject_id")
    );

    const name =
      formData.get("name")?.toString().trim() ?? "";

    const description =
      formData.get("description")?.toString().trim() ?? "";

    // 👇 ADD THIS
    console.log("DEBUG createChapterAction", {
      subject_id,
      name,
      description,
    });

    if (!subject_id || !name) {
      return failure(Messages.chapter.validation);
    }

    await createChapter({
      subject_id,
      name,
      description,
      is_active: true,
    });

    revalidatePath(Routes.repository.chapters);

    return success(Messages.chapter.created);
  } catch (error) {
    console.error(error);

    return failure(Messages.chapter.createError);
  }
}
export async function updateChapterAction(
  id: number,
  formData: FormData
): Promise<ActionResult> {
  try {
    const subject_id = Number(
      formData.get("subject_id")
    );

    const name =
      formData.get("name")?.toString().trim() ?? "";

    const description =
      formData.get("description")?.toString().trim() ?? "";

    if (!subject_id || !name) {
      return failure(Messages.chapter.validation);
    }

    await updateChapter(id, {
      subject_id,
      name,
      description,
    });

    revalidatePath(Routes.repository.chapters);

    return success(Messages.chapter.updated);
  } catch (error) {
    console.error(error);

    return failure(Messages.chapter.updateError);
  }
}

export async function deleteChapterAction(
  id: number
): Promise<ActionResult> {
  try {
    await deleteChapter(id);

    revalidatePath(Routes.repository.chapters);

    return success(Messages.chapter.deleted);
  } catch (error) {
    console.error(error);

    return failure(Messages.chapter.deleteError);
  }
}