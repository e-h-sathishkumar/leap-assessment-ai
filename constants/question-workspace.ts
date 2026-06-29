export const QuestionStatus = [
  "Draft",
  "AI Generated",
  "Reviewed",
  "Approved",
  "Archived",
] as const;

export const CorrectAnswers = [
   "A",
  "B",
  "C",
  "D",
  "E",
] as const;

export const SourceTypes = [
  "Teacher",
  "AI",
  "NCERT",
  "Previous Year",
  "Reference Book",
  "Olympiad",
  "NEET",
  "JEE Main",
  "JEE Advanced",
] as const;

export const AIProviders = [
  "Teacher",
  "Gemini",
  "OpenAI",
  "Claude",
  "NotebookLM",
  "Perplexity",
  "Grok",
] as const;

export const DefaultAssessment = {
  marks: 4,
  negativeMarks: 1,
  estimatedTimeSeconds: 90,
};
export const QuestionWorkspaceTabs = [
  {
    id: "manual",
    title: "Manual Entry",
    icon: "FileText",
  },
  {
    id: "ai",
    title: "Generate with AI",
    icon: "Sparkles",
  },
  {
    id: "upload",
    title: "Generate from File",
    icon: "Upload",
  },
  {
    id: "review",
    title: "Review Queue",
    icon: "ClipboardCheck",
  },
] as const;