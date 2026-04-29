const { sendSuccess, sendError } = require("../utils/response");
const { callOcrSpace } = require("../services/ocrSpaceService");

const extractPdfTextWithOcr = async (req, res) => {
  try {
    if (!req.file) {
      return sendError(res, "PDF or image file is required", 400);
    }

    const result = await callOcrSpace({
      buffer: req.file.buffer,
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
    });

    return sendSuccess(res, {
      text: result.text,
      originalSize: result.originalSize,
      compressedSize: result.compressedSize,
      compressionApplied: result.compressionApplied,
      source: "ocr.space",
    });
  } catch (error) {
    return sendError(
      res,
      "Failed to OCR the uploaded file",
      error.status || 500,
      error.details || error.message
    );
  }
};

module.exports = {
  extractPdfTextWithOcr,
};
