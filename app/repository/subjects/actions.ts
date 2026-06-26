"use server";

import { revalidatePath } from "next/cache";
import {
  createSubject,
  updateSubject,
  deleteSubject,
} from "@/services/subject.service";

export async function createSubjectAction(formData: FormData) {
  const name = formData.get("name")?.toString().trim() ?? "";
  const code = formData.get("code")?.toString().trim() ?? "";
  const description =
    formData.get("description")?.toString().trim() ?? "";

  if (!name || !code) {
    throw new Error("Subject Name and Code are required.");
  }

  await createSubject({
    name,
    code,
    description,
    is_active: true,
  });

  revalidatePath("/repository/subjects");
}

export async function updateSubjectAction(
  id: number,
  formData: FormData
) {
  const name = formData.get("name")?.toString().trim() ?? "";
  const code = formData.get("code")?.toString().trim() ?? "";
  const description =
    formData.get("description")?.toString().trim() ?? "";

  await updateSubject(id, {
    name,
    code,
    description,
  });

  revalidatePath("/repository/subjects");
}

export async function deleteSubjectAction(id: number) {
  await deleteSubject(id);

  revalidatePath("/repository/subjects");
}