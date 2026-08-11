import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    "GEMINI_API_KEY is not configured."
  );
}

const ai = new GoogleGenAI({
  apiKey,
});

export async function generateWithGemini(
  prompt: string
): Promise<string> {
  console.log(
    "========== GEMINI REQUEST =========="
  );

  console.log(
    "Model: gemini-3.5-flash"
  );

  console.log(
    "Prompt characters:",
    prompt.length
  );

  console.log(
    "===================================="
  );

  const response =
    await ai.models.generateContent({
      model: "gemini-3.5-flash",

      contents: prompt,

      config: {
        responseMimeType:
          "application/json",

        responseJsonSchema: {
          type: "object",

          properties: {
            questions: {
              type: "array",

              items: {
                type: "object",

                properties: {
                  question: {
                    type: "string",
                  },

                  options: {
                    type: "object",

                    properties: {
                      A: {
                        type: "string",
                      },

                      B: {
                        type: "string",
                      },

                      C: {
                        type: "string",
                      },

                      D: {
                        type: "string",
                      },
                    },

                    required: [
                      "A",
                      "B",
                      "C",
                      "D",
                    ],
                  },

                  correct_answer: {
                    type: "string",
                  },

                  explanation: {
                    type: "string",
                  },

                  hint: {
                    type: "string",
                  },

                  difficulty: {
                    type: "string",
                  },

                  bloom_level: {
                    type: "string",
                  },

                  learning_objective: {
                    type: "string",
                  },

                  tags: {
                    type: "array",

                    items: {
                      type: "string",
                    },
                  },
                },

                required: [
                  "question",
                  "options",
                  "correct_answer",
                  "explanation",
                  "hint",
                  "difficulty",
                  "bloom_level",
                  "learning_objective",
                  "tags",
                ],
              },
            },
          },

          required: [
            "questions",
          ],
        },
      },
    });

  const text = response.text;

  console.log(
    "========== GEMINI RESPONSE =========="
  );

  console.log(text);

  console.log(
    "======================================"
  );

  if (
    !text ||
    typeof text !== "string" ||
    !text.trim()
  ) {
    throw new Error(
      "Gemini returned an empty response."
    );
  }

  return text.trim();
}