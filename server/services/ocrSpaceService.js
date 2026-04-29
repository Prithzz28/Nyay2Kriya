const { compressPdfBuffer } = require("./pdfCompressionService");

const OCR_URL = "https://api.ocr.space/parse/image";

const extractTextFromOcrResponse = (data) => {
  const parsedResults = Array.isArray(data?.ParsedResults) ? data.ParsedResults : [];
  const text = parsedResults
    .map((result) => result?.ParsedText || "")
    .join("\n\n")
    .trim();

  return text;
};

const callOcrSpace = async ({ buffer, filename, mimetype }) => {
  const apiKey = process.env.OCR_SPACE_API_KEY;

  if (!apiKey) {
    const err = new Error("Server is not configured with OCR_SPACE_API_KEY");
    err.status = 500;
    throw err;
  }

  const compressionResult = mimetype === "application/pdf"
    ? await compressPdfBuffer(buffer)
    : {
        buffer,
        originalSize: buffer.length,
        compressedSize: buffer.length,
        compressionApplied: false,
      };

  const formData = new FormData();
  const uploadBlob = new Blob([compressionResult.buffer], {
    type: mimetype || "application/pdf",
  });

  formData.append("file", uploadBlob, filename || "document.pdf");
  formData.append("language", "eng");
  formData.append("isOverlayRequired", "false");
  formData.append("detectOrientation", "true");
  formData.append("scale", "true");
  formData.append("isTable", "false");
  formData.append("OCREngine", "2");
  if (mimetype === "application/pdf") {
    formData.append("filetype", "PDF");
  }

  const response = await fetch(OCR_URL, {
    method: "POST",
    headers: {
      apikey: apiKey,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    const err = new Error("OCR.Space request failed");
    err.status = 502;
    err.details = JSON.stringify(data);
    throw err;
  }

  if (data?.IsErroredOnProcessing || String(data?.OCRExitCode) === "3") {
    const err = new Error("OCR.Space could not process the uploaded file");
    err.status = 502;
    err.details = `${data?.ErrorMessage || "Unknown OCR error"} ${data?.ErrorDetails || ""}`.trim();
    throw err;
  }

  const text = extractTextFromOcrResponse(data);

  if (!text) {
    const err = new Error("OCR.Space returned no text output");
    err.status = 502;
    err.details = JSON.stringify(data);
    throw err;
  }

  return {
    text,
    originalSize: compressionResult.originalSize,
    compressedSize: compressionResult.compressedSize,
    compressionApplied: compressionResult.compressionApplied,
  };
};

module.exports = {
  callOcrSpace,
};
