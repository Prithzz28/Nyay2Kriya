const safeParseJson = (text) => {
  if (!text || typeof text !== "string") {
    throw new Error("Model output is empty");
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
      throw new Error("Unable to locate JSON object in model output");
    }

    const candidate = text.slice(firstBrace, lastBrace + 1);
    return JSON.parse(candidate);
  }
};

module.exports = {
  safeParseJson,
};
