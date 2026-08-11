import { buildPrompt } from "./prompt-builder";
import { generateWithGemini } from "./gemini-service";
import { parseAIResponse } from "./response-parser";
import { validateQuestions } from "./response-validator";

import type { PromptRequest } from "./types";

export async function generateQuestions(
  request: PromptRequest
) {
  console.log(
    "========== QUESTION GENERATION =========="
  );

  console.log(
    "Request:",
    request
  );

  // =========================================================
  // BUILD PROMPT
  // =========================================================

  const prompt =
    buildPrompt(
      request
    );

  console.log(
    "========== AI PROMPT =========="
  );

  console.log(
    prompt
  );

  console.log(
    "================================"
  );

  // =========================================================
  // CALL GEMINI
  // =========================================================

  const response =
    await generateWithGemini(
      prompt
    );

  console.log(
    "========== GEMINI RAW RESPONSE =========="
  );

  console.log(
    response
  );

  console.log(
    "=========================================="
  );

  // =========================================================
  // PARSE
  // =========================================================

  const parsed =
    parseAIResponse(
      response
    );

  console.log(
    "========== PARSED QUESTIONS =========="
  );

  console.log(
    parsed.questions
  );

  console.log(
    "Question count:",
    parsed.questions.length
  );

  console.log(
    "======================================="
  );

  // =========================================================
  // VALIDATE
  // =========================================================

  const result =
    validateQuestions(
      parsed.questions
    );

  console.log(
    "========== VALIDATION RESULT =========="
  );

  console.log(
    "Valid:",
    result.valid.length
  );

  console.log(
    "Invalid:",
    result.invalid.length
  );

  console.log(
    "======================================="
  );

  return result;
}