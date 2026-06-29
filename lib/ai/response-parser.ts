export function parseAIResponse(
  response: string
) {
  try {
    const cleaned = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (error) {
    console.error(error);

    throw new Error(
      "Invalid AI JSON response."
    );
  }
}