const extractionSystemPrompt = `You are a legal data extraction engine for Indian court judgments.
Return strict JSON only. No markdown. No prose.
If a field is unknown, use null.
Normalize dates as YYYY-MM-DD where possible.
Always fill the requested sections. Prefer inference only when clearly supported by the judgment text.`;

const extractionUserPrompt = (judgmentText, metadata = {}) => `Extract structured data from the following judgment text.

Required JSON shape:
{
  "caseSummary": {
    "caseNumber": string | null,
    "courtName": string | null,
    "dateOfOrder": string | null,
    "caseType": string | null,
    "bench": string | null,
    "urgencyLevel": "Low" | "Medium" | "High" | null
  },
  "parties": {
    "petitioner": string | null,
    "respondent": string | null
  },
  "keyDirections": [
    {
      "direction": string,
      "deadline": string | null,
      "responsibleParty": string | null,
      "priority": "Low" | "Medium" | "High" | null
    }
  ],
  "plainEnglishSummary": string | null,
  "complianceIndicators": {
    "complianceRequired": boolean | null,
    "appealConsideration": boolean | null,
    "appealLimitationDays": number | null
  },
  "riskSignals": {
    "urgencyLevel": "Low" | "Medium" | "High" | null,
    "riskIndicator": string | null
  },
  "confidenceNotes": string[],
  "systemMetadata": {
    "fileName": string | null,
    "pageCount": number | null,
    "extractionTimestamp": string | null
  },
  "court": string | null,
  "bench": string | null,
  "caseNumber": string | null,
  "judgmentDate": string | null,
  "petitioner": string | null,
  "respondent": string | null,
  "legalIssue": string | null,
  "summary": string | null,
  "compensationAmount": number | null,
  "directions": string[],
  "complianceDeadlineDays": number | null,
  "urgency": "Low" | "Medium" | "High" | null
}

Important rules:
- Key directions must be actionable and distinct.
- Deadline may be explicit or inferred only when the judgment makes the timeframe clear.
- Plain-English summary must be 2-3 sentences and avoid legal jargon.
- Confidence notes should flag missing data, assumptions, and inferred deadlines.
- System metadata should echo the provided file metadata when available.

Judgment text:
${judgmentText}

File metadata:
${JSON.stringify(metadata)}`;

const actionPlanSystemPrompt = `You are a legal operations planner for government litigation teams.
Return strict JSON only. No markdown. No prose.
Output concise, practical, operational action items.`;

const actionPlanUserPrompt = (reviewedCaseJson) => `Create an action plan for the reviewed judgment below.

Required JSON shape:
{
  "immediateActions": string[],
  "complianceSteps": string[],
  "appealRecommendation": string,
  "riskSummary": string,
  "ownerSuggestions": string[],
  "targetCompletionDate": string | null
}

Reviewed case JSON:
${reviewedCaseJson}`;

module.exports = {
  extractionSystemPrompt,
  extractionUserPrompt,
  actionPlanSystemPrompt,
  actionPlanUserPrompt,
};
