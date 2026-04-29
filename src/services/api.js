const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

const parseResponse = async (response) => {
  const payload = await response.json();

  if (!response.ok || !payload.success) {
    const message = payload?.error?.message || "Request failed";
    const details = payload?.error?.details;
    throw new Error(details ? `${message}: ${details}` : message);
  }

  return payload.data;
};

export const healthCheck = async () => {
  const response = await fetch(`${API_BASE}/health`);
  return parseResponse(response);
};

export const extractJudgmentData = async ({ judgmentText, demoMode, metadata }) => {
  const response = await fetch(`${API_BASE}/extract`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ judgmentText, demoMode, metadata }),
  });

  return parseResponse(response);
};

export const ocrExtractFile = async (file, filename) => {
  const formData = new FormData();
  formData.append("file", file, filename || file.name || "judgment.pdf");

  const response = await fetch(`${API_BASE}/ocr`, {
    method: "POST",
    body: formData,
  });

  return parseResponse(response);
};

export const ocrExtractPdfText = async (file) => ocrExtractFile(file, file.name);

export const generateCaseActionPlan = async ({ reviewedCase, demoMode }) => {
  const response = await fetch(`${API_BASE}/action-plan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reviewedCase, demoMode }),
  });

  return parseResponse(response);
};
