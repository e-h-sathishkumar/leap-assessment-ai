import TopicsClient from "@/components/topics/TopicsClient";

import { getTopics } from "@/services/topic.service";
import { getSubjects } from "@/services/subject.service";
import { getChapters } from "@/services/chapter.service";

export default async function TopicsPage() {
  const topics = await getTopics();

  const subjects = await getSubjects();

  const chapters = await getChapters();

  return (
    <TopicsClient
      topics={topics}
      subjects={subjects}
      chapters={chapters}
    />
  );
}