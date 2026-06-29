import QuestionWizard from "@/components/question-workspace/wizard/QuestionWizard";
import AIGeneratorForm from "@/components/question-workspace/ai/AIGeneratorForm";

import {
  getSubjects,
  getChapters,
  getTopics,
} from "@/services/lookup.service";

export default async function QuestionWorkspacePage() {
  const [
    subjects,
    chapters,
    topics,
  ] = await Promise.all([
    getSubjects(),
    getChapters(),
    getTopics(),
  ]);

  return (
    <div className="space-y-10">

      <QuestionWizard />

      <AIGeneratorForm
        subjects={subjects}
        chapters={chapters}
        topics={topics}
      />

    </div>
  );
}