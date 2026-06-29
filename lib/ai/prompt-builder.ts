import type { PromptRequest } from "./types";

export function buildPrompt(
  request: PromptRequest
): string {
  return `
You are an expert ${request.exam} question paper setter.

Generate ${request.numberOfQuestions} ORIGINAL questions.

Exam:
${request.exam}

Subject:
${request.subject}

Chapter:
${request.chapter}

Topic:
${request.topic}

Question Type:
${request.questionType}

Difficulty:
${request.difficulty}

Bloom Level:
${request.bloom}

Language:
${request.language}

Requirements:

- Follow the latest ${request.exam} pattern.
- Questions must be original.
- Return JSON only.
- Do not use markdown.

Include Explanation:
${request.includeExplanation ? "YES" : "NO"}

Include Hint:
${request.includeHint ? "YES" : "NO"}

Include Learning Objective:
${request.includeLearningObjective ? "YES" : "NO"}

Include Tags:
${request.includeTags ? "YES" : "NO"}

Avoid Duplicates:
${request.avoidDuplicates ? "YES" : "NO"}

Return JSON:

{
  "questions":[
    {
      "question":"",
      "options":{
        "A":"",
        "B":"",
        "C":"",
        "D":""
      },
      "correct_answer":"A",
      "explanation":"",
      "hint":"",
      "difficulty":"",
      "bloom_level":"",
      "learning_objective":"",
      "tags":[]
    }
  ]
}
`;
}