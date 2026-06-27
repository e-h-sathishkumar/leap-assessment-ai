import ChaptersClient from "@/components/chapters/ChaptersClient";

import { getChapters } from "@/services/chapter.service";
import { getSubjects } from "@/services/subject.service";

export default async function ChaptersPage() {
  const chapters = await getChapters();
  const subjects = await getSubjects();

  return (
    <ChaptersClient
      chapters={chapters}
      subjects={subjects}
    />
  );
}