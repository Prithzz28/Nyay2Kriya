const { sendSuccess, sendError } = require("../utils/response");
const { callGroqForJson } = require("../services/groqService");
const {
  actionPlanSystemPrompt,
  actionPlanUserPrompt,
} = require("../services/promptService");
const { buildDemoActionPlan } = require("../services/demoFallbackService");

const normalizeActionPlan = (raw) => {
  return {
    immediateActions: Array.isArray(raw.immediateActions)
      ? raw.immediateActions.filter((item) => typeof item === "string")
      : [],
    complianceSteps: Array.isArray(raw.complianceSteps)
      ? raw.complianceSteps.filter((item) => typeof item === "string")
      : [],
    appealRecommendation:
      typeof raw.appealRecommendation === "string"
        ? raw.appealRecommendation
        : "No recommendation provided.",
    riskSummary:
      typeof raw.riskSummary === "string" ? raw.riskSummary : "Risk summary unavailable.",
    ownerSuggestions: Array.isArray(raw.ownerSuggestions)
      ? raw.ownerSuggestions.filter((item) => typeof item === "string")
      : [],
    targetCompletionDate:
      typeof raw.targetCompletionDate === "string" ? raw.targetCompletionDate : null,
  };
};

const generateActionPlan = async (req, res) => {
  const { reviewedCase, demoMode } = req.body;

  try {
    let actionPlan;

    if (!process.env.GROQ_API_KEY && demoMode) {
      actionPlan = buildDemoActionPlan(reviewedCase);
    } else {
      actionPlan = await callGroqForJson({
        systemPrompt: actionPlanSystemPrompt,
        userPrompt: actionPlanUserPrompt(JSON.stringify(reviewedCase)),
      });
    }

    return sendSuccess(res, normalizeActionPlan(actionPlan));
  } catch (error) {
    return sendError(
      res,
      "Failed to generate action plan",
      error.status || 500,
      error.details || error.message
    );
  }
};

module.exports = {
  generateActionPlan,
};
