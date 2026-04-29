const { sendError } = require("../utils/response");

const validateExtractPayload = (req, res, next) => {
  const { judgmentText, demoMode, metadata } = req.body || {};

  if (typeof demoMode !== "undefined" && typeof demoMode !== "boolean") {
    return sendError(res, "demoMode must be boolean", 400);
  }

  if (!judgmentText || typeof judgmentText !== "string" || judgmentText.trim().length < 100) {
    return sendError(
      res,
      "judgmentText is required and must contain at least 100 characters",
      400
    );
  }

  if (typeof metadata !== "undefined") {
    if (!metadata || typeof metadata !== "object") {
      return sendError(res, "metadata must be an object when provided", 400);
    }

    if (typeof metadata.fileName !== "undefined" && typeof metadata.fileName !== "string") {
      return sendError(res, "metadata.fileName must be a string", 400);
    }

    if (typeof metadata.pageCount !== "undefined" && typeof metadata.pageCount !== "number") {
      return sendError(res, "metadata.pageCount must be a number", 400);
    }

    if (
      typeof metadata.extractionTimestamp !== "undefined" &&
      typeof metadata.extractionTimestamp !== "string"
    ) {
      return sendError(res, "metadata.extractionTimestamp must be a string", 400);
    }
  }

  return next();
};

const validateActionPlanPayload = (req, res, next) => {
  const { reviewedCase, demoMode } = req.body || {};

  if (typeof demoMode !== "undefined" && typeof demoMode !== "boolean") {
    return sendError(res, "demoMode must be boolean", 400);
  }

  if (!reviewedCase || typeof reviewedCase !== "object") {
    return sendError(res, "reviewedCase object is required", 400);
  }

  if (!reviewedCase.caseNumber || !reviewedCase.court || !reviewedCase.judgmentDate) {
    return sendError(
      res,
      "reviewedCase must include caseNumber, court, and judgmentDate",
      400
    );
  }

  return next();
};

module.exports = {
  validateExtractPayload,
  validateActionPlanPayload,
};
