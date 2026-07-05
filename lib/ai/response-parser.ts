export function parseAIResponse(response: string) {
  try {
    const cleaned = response
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // Extract the first JSON object if extra text exists
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start === -1 || end === -1) {
      throw new Error("No JSON object found.");
    }

    const jsonText = cleaned.substring(start, end + 1);

    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Failed to parse AI response:");
    console.error(response);
    throw new Error("Invalid AI JSON response.");
  }
}