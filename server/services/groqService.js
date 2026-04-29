const { safeParseJson } = require("../utils/jsonParser");

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

const callGroqForJson = async ({ systemPrompt, userPrompt }) => {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    const err = new Error("Server is not configured with GROQ_API_KEY");
    err.status = 500;
    throw err;
  }

  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    const err = new Error("Groq request failed");
    err.status = 502;
    err.details = errorText;
    throw err;
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  return safeParseJson(content);
};

module.exports = {
  callGroqForJson,
};
