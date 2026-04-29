const { sendSuccess, sendError } = require("../utils/response");
const { callGroqForJson } = require("../services/groqService");
const {
  extractionSystemPrompt,
  extractionUserPrompt,
} = require("../services/promptService");
const { buildDemoExtractedData } = require("../services/demoFallbackService");

const normalizeExtraction = (raw) => {
  const caseSummary = raw.caseSummary || {};
  const parties = raw.parties || {};
  const keyDirections = Array.isArray(raw.keyDirections) ? raw.keyDirections : [];
  const confidenceNotes = Array.isArray(raw.confidenceNotes) ? raw.confidenceNotes : [];
  const urgencyLevel =
    caseSummary.urgencyLevel === "Low" ||
    caseSummary.urgencyLevel === "Medium" ||
    caseSummary.urgencyLevel === "High"
      ? caseSummary.urgencyLevel
      : raw.urgency === "Low" || raw.urgency === "Medium" || raw.urgency === "High"
        ? raw.urgency
        : null;

  const normalizedDirections = keyDirections
    .map((item) => ({
      direction:
        typeof item.direction === "string" ? item.direction.trim() : String(item.direction || "").trim(),
      deadline: typeof item.deadline === "string" ? item.deadline : null,
      responsibleParty:
        typeof item.responsibleParty === "string" ? item.responsibleParty : null,
      priority:
        item.priority === "Low" || item.priority === "Medium" || item.priority === "High"
          ? item.priority
          : urgencyLevel,
    }))
    .filter((item) => item.direction);

  return {
    caseSummary: {
      caseNumber: caseSummary.caseNumber ?? raw.caseNumber ?? null,
      courtName: caseSummary.courtName ?? raw.court ?? null,
      dateOfOrder: caseSummary.dateOfOrder ?? raw.judgmentDate ?? null,
      caseType: caseSummary.caseType ?? raw.caseType ?? null,
      bench: caseSummary.bench ?? raw.bench ?? null,
      urgencyLevel,
    },
    parties: {
      petitioner: parties.petitioner ?? raw.petitioner ?? null,
      respondent: parties.respondent ?? raw.respondent ?? null,
    },
    keyDirections: normalizedDirections,
    plainEnglishSummary: raw.plainEnglishSummary ?? raw.summary ?? null,
    complianceIndicators: {
      complianceRequired:
        typeof raw?.complianceIndicators?.complianceRequired === "boolean"
          ? raw.complianceIndicators.complianceRequired
          : null,
      appealConsideration:
        typeof raw?.complianceIndicators?.appealConsideration === "boolean"
          ? raw.complianceIndicators.appealConsideration
          : null,
      appealLimitationDays:
        typeof raw?.complianceIndicators?.appealLimitationDays === "number"
          ? raw.complianceIndicators.appealLimitationDays
          : null,
    },
    riskSignals: {
      urgencyLevel:
        raw?.riskSignals?.urgencyLevel === "Low" ||
        raw?.riskSignals?.urgencyLevel === "Medium" ||
        raw?.riskSignals?.urgencyLevel === "High"
          ? raw.riskSignals.urgencyLevel
          : raw.urgency === "Low" || raw.urgency === "Medium" || raw.urgency === "High"
            ? raw.urgency
            : null,
      riskIndicator: raw?.riskSignals?.riskIndicator ?? null,
    },
    confidenceNotes: confidenceNotes.filter((item) => typeof item === "string" && item.trim()),
    systemMetadata: {
      fileName: raw?.systemMetadata?.fileName ?? null,
      pageCount:
        typeof raw?.systemMetadata?.pageCount === "number" ? raw.systemMetadata.pageCount : null,
      extractionTimestamp: raw?.systemMetadata?.extractionTimestamp ?? null,
    },
    court: caseSummary.courtName ?? raw.court ?? null,
    bench: caseSummary.bench ?? raw.bench ?? null,
    caseNumber: caseSummary.caseNumber ?? raw.caseNumber ?? null,
    judgmentDate: caseSummary.dateOfOrder ?? raw.judgmentDate ?? null,
    petitioner: parties.petitioner ?? raw.petitioner ?? null,
    respondent: parties.respondent ?? raw.respondent ?? null,
    legalIssue: raw.legalIssue ?? null,
    summary: raw.plainEnglishSummary ?? raw.summary ?? null,
    compensationAmount:
      typeof raw.compensationAmount === "number" ? raw.compensationAmount : null,
    directions: normalizedDirections.map((item) => item.direction),
    complianceDeadlineDays:
      typeof raw.complianceDeadlineDays === "number"
        ? raw.complianceDeadlineDays
        : typeof raw?.complianceIndicators?.appealLimitationDays === "number"
          ? raw.complianceIndicators.appealLimitationDays
          : null,
    urgency: urgencyLevel,
    caseType: caseSummary.caseType ?? raw.caseType ?? null,
    plainEnglishSummary: raw.plainEnglishSummary ?? raw.summary ?? null,
    keyDirectionTable: normalizedDirections,
    confidenceNotes: confidenceNotes.filter((item) => typeof item === "string" && item.trim()),
    complianceRequired:
      typeof raw?.complianceIndicators?.complianceRequired === "boolean"
        ? raw.complianceIndicators.complianceRequired
        : null,
    appealConsideration:
      typeof raw?.complianceIndicators?.appealConsideration === "boolean"
        ? raw.complianceIndicators.appealConsideration
        : null,
    appealLimitationDays:
      typeof raw?.complianceIndicators?.appealLimitationDays === "number"
        ? raw.complianceIndicators.appealLimitationDays
        : null,
    riskIndicator: raw?.riskSignals?.riskIndicator ?? null,
  };
};

const extractJudgment = async (req, res) => {
  const { judgmentText, demoMode, metadata } = req.body;

  try {
    let extracted;

    if (!process.env.GROQ_API_KEY && demoMode) {
      extracted = buildDemoExtractedData(judgmentText);
    } else {
      extracted = await callGroqForJson({
        systemPrompt: extractionSystemPrompt,
        userPrompt: extractionUserPrompt(judgmentText, metadata),
      });
    }

    return sendSuccess(res, normalizeExtraction(extracted));
  } catch (error) {
    return sendError(
      res,
      "Failed to extract structured legal data",
      error.status || 500,
      error.details || error.message
    );
  }
};

module.exports = {
  extractJudgment,
};
