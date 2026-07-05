import TestsClient from "@/components/tests/TestsClient";

import { getTests } from "@/services/test.service";
import { getSubjects } from "@/services/subject.service";

export default async function TestsPage() {
  const [tests, subjects] =
    await Promise.all([
      getTests(),
      getSubjects(),
    ]);

  return (
    <TestsClient
      tests={tests}
      subjects={subjects}
    />
  );
}