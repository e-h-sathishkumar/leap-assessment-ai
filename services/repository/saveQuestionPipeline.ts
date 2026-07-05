import { saveQuestion } from "./question.service";

export async function saveQuestionPipeline(question: any) {
  // TODO: AI validation will be added here later

  const saved = await saveQuestion(question);

  return {
    success: true,
    question: saved,
  };
}