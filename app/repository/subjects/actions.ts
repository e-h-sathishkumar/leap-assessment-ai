"use server";

import { revalidatePath } from "next/cache";

import {
  createSubject,
  updateSubject,
  deleteSubject,
} from "@/services/subject.service";

import { success, failure } from "@/lib/action-response";
import { ActionResult } from "@/types/action-result";

export async function createSubjectAction(
  formData: FormData
): Promise<ActionResult> {
  try {
    const name =
      formData.get("name")?.toString().trim() ?? "";

    const code =
      formData.get("code")?.toString().trim() ?? "";

    const description =
      formData.get("description")?.toString().trim() ?? "";

    if (!name || !code) {
      return failure(
        "Subject name and code are required."
      );
    }

    await createSubject({
      name,
      code,
      description,
      is_active: true,
    });

    revalidatePath("/repository/subjects");

    return success(
      "Subject created successfully."
    );
  } catch (error) {
    console.error(error);

    return failure(
      "Unable to create subject."
    );
  }
}

export async function updateSubjectAction(
  id: number,
  formData: FormData
): Promise<ActionResult> {
  try {
    const name =
      formData.get("name")?.toString().trim() ?? "";

    const code =
      formData.get("code")?.toString().trim() ?? "";

    const description =
      formData.get("description")?.toString().trim() ?? "";

    if (!name || !code) {
      return failure(
        "Subject name and code are required."
      );
    }

    await updateSubject(id, {
      name,
      code,
      description,
    });

    revalidatePath("/repository/subjects");

    return success(
      "Subject updated successfully."
    );
  } catch (error) {
    console.error(error);

    return failure(
      "Unable to update subject."
    );
  }
}

export async function deleteSubjectAction(
  id: number
): Promise<ActionResult> {
  try {
    await deleteSubject(id);

    revalidatePath("/repository/subjects");

    return success(
      "Subject deleted successfully."
    );
  } catch (error) {
    console.error(error);

    return failure(
      "Unable to delete subject."
    );
  }
}