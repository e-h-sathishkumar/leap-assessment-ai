import type { PromptRequest } from "./types";

export function buildPrompt(
  request: PromptRequest
): string {
  const chapter =
    request.chapter?.trim() || "";

  const topic =
    request.topic?.trim() || "";

  const additionalInstructions =
    request.additionalInstructions?.trim() || "";

  // =========================================================
  // ACADEMIC SCOPE
  // =========================================================

  const academicScope = `
EXAM / FRAMEWORK:
${request.exam}

CLASS:
${request.className}

SUBJECT:
${request.subject}

CHAPTER:
${
  chapter
    ? chapter
    : "Not specified. AI may select appropriate content from the selected subject."
}

TOPIC:
${
  topic
    ? topic
    : "Not specified. AI may select appropriate concepts."
}
`;

  // =========================================================
  // SCOPE INSTRUCTION
  // =========================================================

  let scopeInstruction = "";

  if (chapter && topic) {
    scopeInstruction = `
The teacher selected a specific academic scope.

Chapter:
${chapter}

Topic:
${topic}

Generate questions specifically from this
chapter and topic.
`;
  } else if (chapter) {
    scopeInstruction = `
The teacher selected the following chapter:

Chapter:
${chapter}

No specific topic was selected.

Generate questions from suitable concepts,
subtopics and sections within this chapter.
`;
  } else if (topic) {
    scopeInstruction = `
No specific chapter was selected.

The teacher specified this topic:

Topic:
${topic}

Generate questions appropriate to this topic
within the selected subject and class.
`;
  } else {
    scopeInstruction = `
No chapter or topic was selected.

This is intentional.

Use:

Exam / Framework
Class
Subject

to determine appropriate academic content.

You may select suitable chapters, concepts
and topics from the selected subject.

DO NOT refuse generation because Chapter
or Topic is not specified.
`;
  }

  // =========================================================
  // QUESTION TYPE
  // =========================================================

  const questionTypeInstruction =
    request.questionType?.trim()
      ? `
QUESTION TYPE:
${request.questionType}

Follow the requested question type(s).
`
      : `
QUESTION TYPE:
Use the standard question type appropriate
for the selected examination framework.
`;

  // =========================================================
  // DIFFICULTY
  // =========================================================

  const difficultyInstruction = `
DIFFICULTY:
${request.difficulty}

BLOOM LEVEL:
${request.bloom}
`;

  // =========================================================
  // OPTIONAL FEATURES
  // =========================================================

  const featureInstructions = `
EXPLANATION:
${
  request.includeExplanation
    ? "Include a clear explanation."
    : "Explanation may be omitted."
}

HINT:
${
  request.includeHint
    ? "Include a useful hint."
    : "Do not include a hint."
}

LEARNING OBJECTIVE:
${
  request.includeLearningObjective
    ? "Include a concise learning objective."
    : "Learning objective may be omitted."
}

TAGS:
${
  request.includeTags
    ? "Include relevant academic tags."
    : "Tags may be omitted."
}

DUPLICATES:
${
  request.avoidDuplicates
    ? "Do not generate duplicate or substantially similar questions."
    : "Duplicate questions are permitted."
}
`;

  // =========================================================
  // ADDITIONAL TEACHER INSTRUCTIONS
  // =========================================================

  const teacherInstructions =
    additionalInstructions
      ? `
ADDITIONAL TEACHER INSTRUCTIONS:

${additionalInstructions}
`
      : "";

  // =========================================================
  // FINAL PROMPT
  // =========================================================

  return `
You are LEAP Assessment AI.

You are an expert educational assessment
question generator.

Generate high-quality, academically accurate
questions for the specified examination
framework, class and subject.

================================================
ACADEMIC CONTEXT
================================================

${academicScope}

${scopeInstruction}

================================================
QUESTION CONFIGURATION
================================================

${questionTypeInstruction}

${difficultyInstruction}

${featureInstructions}

${teacherInstructions}

================================================
NUMBER OF QUESTIONS
================================================

Generate exactly ${
    request.numberOfQuestions
  } questions.

Language:
${request.language}

================================================
STRICT OUTPUT FORMAT
================================================

Return ONLY valid JSON.

Do NOT return Markdown.

Do NOT wrap the JSON inside:
\`\`\`json
\`\`\`

Do NOT add any explanation outside the JSON.

The JSON MUST have exactly this top-level
structure:

{
  "questions": [
    {
      "question": "Question text",

      "options": {
        "A": "First option",
        "B": "Second option",
        "C": "Third option",
        "D": "Fourth option"
      },

      "correct_answer": "A",

      "explanation": "Explanation of the correct answer",

      "hint": "Useful hint",

      "difficulty": "Medium",

      "bloom_level": "Apply",

      "learning_objective": "Learning objective",

      "tags": [
        "tag1",
        "tag2"
      ]
    }
  ]
}

================================================
STRICT FIELD RULES
================================================

1. "question" must contain the complete question.

2. "options" MUST be an OBJECT.

3. The options object MUST contain exactly:

   "A"
   "B"
   "C"
   "D"

4. Do NOT return options as an array.

5. "correct_answer" MUST contain only one
   option letter:

   "A"
   "B"
   "C"
   "D"

6. Do NOT use:

   "correctAnswer"

   Use:

   "correct_answer"

7. Do NOT use:

   "bloom"

   Use:

   "bloom_level"

8. Do NOT use:

   "learningObjective"

   Use:

   "learning_objective"

9. Every question must have all four options.

10. Every question must have a valid correct answer.

11. Questions must be appropriate for:

    Exam + Class + Subject

12. Chapter is optional.

13. Topic is optional.

14. If Chapter and Topic are absent, AI must
    choose suitable academic content itself.

15. Do not invent facts.

16. Avoid duplicate questions.

17. Return exactly ${
    request.numberOfQuestions
  } questions.

================================================
FINAL VALIDATION BEFORE RESPONSE
================================================

Before returning the JSON, verify that EVERY
question contains:

- question
- options.A
- options.B
- options.C
- options.D
- correct_answer

If any required field is missing, fix it
before returning the response.

Return JSON ONLY.
`;
}