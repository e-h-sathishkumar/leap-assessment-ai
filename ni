import type { PromptRequest } from "./types";

export function buildPrompt(
  request: PromptRequest
): string {
  return `
You are an expert ${request.exam} question paper setter.

Generate ${request.numberOfQuestions} ORIGINAL questions.

Academic Details

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

Requirements

1. Follow the latest ${request.exam} examination pattern.

2. Questions must be conceptually correct.

3. Do not copy previous year questions.

4. Create realistic distractors.

5. Avoid ambiguous wording.

6. Return JSON ONLY.

Include

Explanation:
${request.includeExplanation ? "YES" : "NO"}

Hint:
${request.includeHint ? "YES" : "NO"}

Learning Objective:
${request.includeLearningObjective ? "YES" : "NO"}

Tags:
${request.includeTags ? "YES" : "NO"}

Avoid Duplicates:
${request.avoidDuplicates ? "YES" : "NO"}

Return JSON using this format only:

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

Do NOT return Markdown.

Do NOT return explanations outside JSON.
`;
}