import CreateTestWizard from "@/components/assessment/wizard/CreateTestWizard";

import { getSubjects } from "@/services/subject.service";
import { getChapters } from "@/services/chapter.service";
import { getTopics } from "@/services/topic.service";

export default async function CreateAssessmentPage() {
  const [subjects, chapters, topics] =
    await Promise.all([
      getSubjects(),
      getChapters(),
      getTopics(),
    ]);

  return (
    <CreateTestWizard
      subjects={subjects}
      chapters={chapters}
      topics={topics}
    />
  );
}