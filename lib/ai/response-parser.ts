interface ParsedAIResponse {
  questions: unknown[];
}

export function parseAIResponse(
  response: string
): ParsedAIResponse {
  console.log(
    "========== AI RESPONSE PARSER =========="
  );

  console.log(
    "Raw response type:",
    typeof response
  );

  console.log(
    "Raw response:"
  );

  console.log(
    response
  );

  console.log(
    "========================================="
  );

  if (
    !response ||
    typeof response !== "string"
  ) {
    throw new Error(
      "AI returned an empty response."
    );
  }

  // =========================================================
  // CLEAN RESPONSE
  // =========================================================

  let cleaned =
    response
      .trim()
      .replace(
        /^\uFEFF/,
        ""
      );

  // Remove Markdown code fences.
  cleaned =
    cleaned.replace(
      /```json/gi,
      ""
    );

  cleaned =
    cleaned.replace(
      /```javascript/gi,
      ""
    );

  cleaned =
    cleaned.replace(
      /```js/gi,
      ""
    );

  cleaned =
    cleaned.replace(
      /```/g,
      ""
    );

  cleaned =
    cleaned.trim();

  console.log(
    "========== CLEANED AI RESPONSE =========="
  );

  console.log(
    cleaned
  );

  console.log(
    "=========================================="
  );

  // =========================================================
  // FIRST ATTEMPT:
  // PARSE THE ENTIRE RESPONSE
  // =========================================================

  try {
    const parsed =
      JSON.parse(
        cleaned
      );

    console.log(
      "========== DIRECT JSON PARSE SUCCESS =========="
    );

    return normalizeParsedResponse(
      parsed
    );
  } catch {
    console.log(
      "Direct JSON parse failed. Trying JSON extraction..."
    );
  }

  // =========================================================
  // SECOND ATTEMPT:
  // FIND JSON OBJECT
  // =========================================================

  const objectStart =
    cleaned.indexOf("{");

  const objectEnd =
    cleaned.lastIndexOf("}");

  if (
    objectStart !== -1 &&
    objectEnd !== -1 &&
    objectEnd > objectStart
  ) {
    const possibleObject =
      cleaned.substring(
        objectStart,
        objectEnd + 1
      );

    try {
      const parsed =
        JSON.parse(
          possibleObject
        );

      console.log(
        "========== EXTRACTED OBJECT PARSE SUCCESS =========="
      );

      return normalizeParsedResponse(
        parsed
      );
    } catch (error) {
      console.error(
        "Object JSON parse failed:",
        error
      );
    }
  }

  // =========================================================
  // THIRD ATTEMPT:
  // FIND JSON ARRAY
  // =========================================================

  const arrayStart =
    cleaned.indexOf("[");

  const arrayEnd =
    cleaned.lastIndexOf("]");

  if (
    arrayStart !== -1 &&
    arrayEnd !== -1 &&
    arrayEnd > arrayStart
  ) {
    const possibleArray =
      cleaned.substring(
        arrayStart,
        arrayEnd + 1
      );

    try {
      const parsed =
        JSON.parse(
          possibleArray
        );

      console.log(
        "========== EXTRACTED ARRAY PARSE SUCCESS =========="
      );

      return normalizeParsedResponse(
        parsed
      );
    } catch (error) {
      console.error(
        "Array JSON parse failed:",
        error
      );
    }
  }

  // =========================================================
  // FAILED
  // =========================================================

  console.error(
    "========== INVALID AI JSON =========="
  );

  console.error(
    "The AI response could not be parsed:"
  );

  console.error(
    response
  );

  console.error(
    "====================================="
  );

  throw new Error(
    "Invalid AI JSON response."
  );
}


// ===========================================================
// NORMALIZE DIFFERENT AI RESPONSE FORMATS
// ===========================================================

function normalizeParsedResponse(
  parsed: unknown
): ParsedAIResponse {

  // =========================================================
  // FORMAT 1
  //
  // {
  //   "questions": [...]
  // }
  // =========================================================

  if (
    parsed &&
    typeof parsed === "object" &&
    !Array.isArray(parsed)
  ) {
    const object =
      parsed as Record<
        string,
        unknown
      >;

    if (
      Array.isArray(
        object.questions
      )
    ) {
      console.log(
        "AI format detected: { questions: [] }"
      );

      return {
        questions:
          object.questions,
      };
    }

    // Some models may return:
    //
    // {
    //   "data": {
    //      "questions": [...]
    //   }
    // }

    if (
      object.data &&
      typeof object.data === "object" &&
      !Array.isArray(object.data)
    ) {
      const data =
        object.data as Record<
          string,
          unknown
        >;

      if (
        Array.isArray(
          data.questions
        )
      ) {
        console.log(
          "AI format detected: { data: { questions: [] } }"
        );

        return {
          questions:
            data.questions,
        };
      }
    }
  }

  // =========================================================
  // FORMAT 2
  //
  // [
  //   {...},
  //   {...}
  // ]
  // =========================================================

  if (
    Array.isArray(parsed)
  ) {
    console.log(
      "AI format detected: direct question array."
    );

    return {
      questions:
        parsed,
    };
  }

  // =========================================================
  // INVALID STRUCTURE
  // =========================================================

  console.error(
    "Parsed JSON does not contain questions."
  );

  console.error(
    parsed
  );

  throw new Error(
    "AI response does not contain a questions array."
  );
}