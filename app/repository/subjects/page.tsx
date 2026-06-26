import SubjectsClient from "@/components/subjects/SubjectsClient";
import { getSubjects } from "@/services/subject.service";

export default async function SubjectsPage() {
  const subjects = await getSubjects();

  return (
    <SubjectsClient
      subjects={subjects}
    />
  );
}