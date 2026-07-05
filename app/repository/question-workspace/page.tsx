import QuestionWorkspace from "@/components/question-workspace/QuestionWorkspace";

import GeneratedQuestionsProvider from "@/components/question-editor/context/GeneratedQuestionsProvider";

export default function Page() {
  return (
    <GeneratedQuestionsProvider>
      <QuestionWorkspace />
    </GeneratedQuestionsProvider>
  );
}