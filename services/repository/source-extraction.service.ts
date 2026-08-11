import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export interface ExtractedTopic {
  name: string;
}

export interface ExtractedChapter {
  name: string;
  topics: ExtractedTopic[];
}

export interface ExtractedSubject {
  name: string;
  chapters: ExtractedChapter[];
}

export interface AcademicExtractionResult {
  sourceTitle: string;
  exam: string;
  className: string;
  subjects: ExtractedSubject[];
}

function cleanJson(text: string): string {
  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}
function buildPrompt(sourceName: string): string {
  return `
You are the Academic Repository Extraction AI for LEAP Assessment AI.

Analyse the supplied educational source and build its academic hierarchy.

The hierarchy must capture the structure actually present in the source:

SOURCE
→ EXAM / CURRICULUM
→ CLASS
→ SUBJECT
→ CHAPTER / UNIT
→ TOPIC / SECTION / SUBTOPIC

Your task is NOT to create questions.
Your task is to identify the academic structure of the source.

Extract:

1. Exam / curriculum
2. Class / grade
3. Subject
4. Chapter or Unit
5. Topics, sections and subtopics belonging to each chapter

IMPORTANT TOPIC EXTRACTION RULES:

- Examine the table of contents when present.
- Examine chapter headings.
- Examine section headings.
- Examine subsection headings.
- Examine numbered headings.
- Examine named concepts that are clearly presented as separate sections.
- Use the source's own terminology.
- If a chapter contains clearly identifiable sections or subsections, extract them as topics.
- Topics may contain multiple words.
- Preserve the order in which chapters and topics appear.
- Do not invent topics that are not supported by the source.
- Do not convert ordinary explanatory paragraphs into topics.
- Do not use page numbers as topics.
- Do not use headers or footers as topics.
- Do not use question numbers or exercise questions as topics.
- Do not use repeated running text as topics.
- Do not create duplicate chapters.
- Do not create duplicate topics within a chapter.

A topic should represent a meaningful academic section of a chapter.

For example, if the source contains:

Chapter: Human Reproduction

1.1 Male Reproductive System
1.2 Female Reproductive System
1.3 Gametogenesis
1.4 Menstrual Cycle
1.5 Fertilisation

then return:

{
  "name": "Human Reproduction",
  "topics": [
    { "name": "Male Reproductive System" },
    { "name": "Female Reproductive System" },
    { "name": "Gametogenesis" },
    { "name": "Menstrual Cycle" },
    { "name": "Fertilisation" }
  ]
}

Do NOT create topics merely because you know they are normally part of this chapter.

Only use information supported by the supplied source.

If the source genuinely contains no identifiable topics for a chapter, then and only then return:

"topics": []

Return ONLY valid JSON.

Use exactly this structure:

{
  "sourceTitle": "${sourceName}",
  "exam": "",
  "className": "",
  "subjects": [
    {
      "name": "",
      "chapters": [
        {
          "name": "",
          "topics": [
            {
              "name": ""
            }
          ]
        }
      ]
    }
  ]
}

Additional rules:

- If multiple subjects are present, extract each subject separately.
- If multiple classes are present, identify the applicable class.
- Preserve official chapter names.
- Preserve official topic/section names.
- Preserve source order.
- Remove duplicates.
- Do not summarize.
- Do not generate questions.
- Do not add explanations.
- Do not use outside knowledge.
- Return JSON only.
`;
}
function normalizeResult(
  value: any,
  sourceTitle: string
): AcademicExtractionResult {
  const subjects = Array.isArray(value?.subjects)
    ? value.subjects
    : [];

  return {
    sourceTitle:
      String(
        value?.sourceTitle || sourceTitle
      ).trim(),

    exam:
      String(
        value?.exam || ""
      ).trim(),

    className:
      String(
        value?.className || ""
      ).trim(),

    subjects: subjects
      .filter(
        (subject: any) =>
          subject &&
          typeof subject.name === "string" &&
          subject.name.trim()
      )
      .map((subject: any) => ({
        name:
          subject.name.trim(),

        chapters:
          Array.isArray(
            subject.chapters
          )
            ? subject.chapters
                .filter(
                  (chapter: any) =>
                    chapter &&
                    typeof chapter.name ===
                      "string" &&
                    chapter.name.trim()
                )
                .map(
                  (chapter: any) => ({
                    name:
                      chapter.name.trim(),

                    topics:
                      Array.isArray(
                        chapter.topics
                      )
                        ? chapter.topics
                            .filter(
                              (topic: any) =>
                                topic &&
                                typeof topic.name ===
                                  "string" &&
                                topic.name.trim()
                            )
                            .map(
                              (topic: any) => ({
                                name:
                                  topic.name.trim(),
                              })
                            )
                        : [],
                  })
                )
            : [],
      })),
  };
}

export async function extractAcademicHierarchy(
  file: File
): Promise<AcademicExtractionResult> {
  const bytes =
    new Uint8Array(
      await file.arrayBuffer()
    );

  const mimeType =
    file.type ||
    "application/octet-stream";

  /*
   * Gemini can process the original document/image
   * directly. We therefore don't depend on PDF text
   * extraction for scanned PDFs.
   */

  const prompt =
    buildPrompt(file.name);

  const response =
    await ai.models.generateContent({
      model:
        "gemini-2.5-flash",

      contents: [
        {
          role: "user",

          parts: [
            {
              inlineData: {
                mimeType,
                data: Buffer.from(
                  bytes
                ).toString(
                  "base64"
                ),
              },
            },

            {
              text: prompt,
            },
          ],
        },
      ],

      config: {
        responseMimeType:
          "application/json",
      },
    });

  const text =
    response.text || "";

  if (!text.trim()) {
    throw new Error(
      "AI returned an empty extraction response."
    );
  }

  let parsed: any;

  try {
    parsed =
      JSON.parse(
        cleanJson(text)
      );
  } catch {
    console.error(
      "Invalid AI extraction JSON:",
      text
    );

    throw new Error(
      "AI returned invalid academic hierarchy JSON."
    );
  }

  const result =
    normalizeResult(
      parsed,
      file.name
    );

  if (
    result.subjects.length ===
    0
  ) {
    throw new Error(
      "AI could not identify any subjects from this source."
    );
  }

  return result;
}