export function parseAIResponse(response: string) {
  try {
    console.log("========== RAW AI RESPONSE ==========");
    console.log(response);
    console.log("=====================================");

    let cleaned = response
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start === -1 || end === -1) {
      throw new Error("No JSON object found.");
    }

    cleaned = cleaned.substring(start, end + 1);

    console.log("========== CLEANED JSON ==========");
    console.log(cleaned);
    console.log("==================================");

    return JSON.parse(cleaned);

  } catch (error) {

    console.error("========== PARSE ERROR ==========");
    console.error(response);
    console.error("=================================");

    throw new Error("Invalid AI JSON response.");
  }
}