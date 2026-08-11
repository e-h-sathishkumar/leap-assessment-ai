"use client";

import AIReview from "./AIReview";
import QuestionProvider from "./context/QuestionProvider";
import QuestionToolbar from "./QuestionToolbar";
import QuestionMetadata from "./QuestionMetadata";
import QuestionContent from "./QuestionContent";
import OptionEditor from "./OptionEditor";
import AnswerEditor from "./AnswerEditor";
import ExplanationEditor from "./ExplanationEditor";
import QuestionActions from "./QuestionActions";
import GeneratedQuestionsGrid from "./GeneratedQuestionsGrid";

export default function QuestionEditor() {
  return (
    <QuestionProvider>
      <div className="space-y-6">
        <QuestionToolbar />

        <QuestionMetadata />

        <QuestionContent />

        <OptionEditor />

        <AnswerEditor />

        <ExplanationEditor />

        <QuestionActions />

        <GeneratedQuestionsGrid />

        <AIReview />
      </div>
    </QuestionProvider>
  );
}