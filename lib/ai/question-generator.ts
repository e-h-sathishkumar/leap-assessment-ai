import { buildPrompt } from "./prompt-builder";
import { generateWithGemini } from "./gemini-service";
import { parseAIResponse } from "./response-parser";
import { validateQuestions } from "./response-validator";

import type { PromptRequest } from "./types";

export async function generateQuestions(
  request: PromptRequest
) {
  const prompt = buildPrompt(request);

  const response = await generateWithGemini(prompt);

  console.log("========== GEMINI RAW RESPONSE ==========");
  console.log(response);
  console.log("=========================================");

  const json = parseAIResponse(response);

  return validateQuestions(json.questions);
}