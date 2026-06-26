"use server";

import { revalidatePath } from "next/cache";
import { createSubject } from "@/services/subject.service";

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