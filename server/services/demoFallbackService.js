const buildDemoExtractedData = (judgmentText) => {
  const timestamp = new Date().toISOString();

  return {
    caseSummary: {
      caseNumber: "W.P. No. 18432/2022 (LA-RES)",
      courtName: "High Court of Karnataka at Bengaluru",
      dateOfOrder: "2025-01-16",
      caseType: "Writ Petition",
      bench: "Hon'ble Justice R. Narayanan and Hon'ble Justice S. Mehta",
      urgencyLevel: judgmentText.toLowerCase().includes("compliance") ? "High" : "Medium",
    },
    parties: {
      petitioner: "Sri Arun Kumar and Others",
      respondent: "State of Karnataka and Land Acquisition Officer",
    },
    keyDirections: [
      {
        direction: "Recalculate compensation in accordance with law and comparable sale instances.",
        deadline: "90 days",
        responsibleParty: "Land Acquisition Officer / State Government",
        priority: "High",
      },
      {
        direction: "File a compliance report after recalculation with calculation sheet and disbursement details.",
        deadline: "15 days after recalculation",
        responsibleParty: "Government Pleader / District Administration",
        priority: "High",
      },
    ],
    plainEnglishSummary:
      "The petitioners challenged the compensation award in a land acquisition matter. The court held the earlier valuation was incomplete and directed the authority to recalculate compensation within 90 days and file a compliance report.",
    complianceIndicators: {
      complianceRequired: true,
      appealConsideration: true,
      appealLimitationDays: 90,
    },
    riskSignals: {
      urgencyLevel: judgmentText.toLowerCase().includes("compliance") ? "High" : "Medium",
      riskIndicator: "Non-compliance may lead to contempt of court and additional financial liability.",
    },
    confidenceNotes: [
      "Deadline inferred from the operative portion of the order.",
      "Petitioner/respondent names are summarized from the judgment text.",
    ],
    systemMetadata: {
      fileName: "Demo_Land_Acquisition_Judgment.pdf",
      pageCount: 4,
      extractionTimestamp: timestamp,
    },
    court: "High Court of Karnataka at Bengaluru",
    bench: "Hon'ble Justice R. Narayanan and Hon'ble Justice S. Mehta",
    caseNumber: "W.P. No. 18432/2022 (LA-RES)",
    judgmentDate: "2025-01-16",
    petitioner: "Sri Arun Kumar and Others",
    respondent: "State of Karnataka and Land Acquisition Officer",
    caseType: "Writ Petition",
    legalIssue: "Challenge to compensation determination under land acquisition proceedings",
    summary:
      "The petitioners sought recalculation of compensation citing improper valuation methodology and exclusion of comparable sale deeds.",
    compensationAmount: 4250000,
    directions: [
      "The respondent authority shall recalculate compensation within 90 days from receipt of this order.",
      "A compliance report shall be filed before the Registrar (Judicial) within 15 days after recalculation."
    ],
    complianceDeadlineDays: 90,
    urgency: judgmentText.toLowerCase().includes("compliance") ? "High" : "Medium",
  };
};

const buildDemoActionPlan = (reviewedCase) => {
  return {
    immediateActions: [
      "Issue certified copy and circulate order to District Land Acquisition Officer.",
      "Constitute valuation review cell with revenue and legal officers within 3 working days.",
      "Open compliance tracker entry with case metadata and statutory deadlines."
    ],
    complianceSteps: [
      "Recompute compensation using court-accepted comparable sale deeds and statutory solatium.",
      "Prepare speaking order showing calculation matrix and reasons for each adjustment.",
      "File compliance report before the Registrar (Judicial) with annexed valuation statement."
    ],
    appealRecommendation:
      "Appeal is not advised unless fresh documentary evidence can establish patent jurisdictional error in valuation reasoning.",
    riskSummary:
      "Delay beyond 90 days may trigger contempt exposure, accrual of additional interest, and adverse audit remarks.",
    ownerSuggestions: [
      "District Land Acquisition Officer",
      "Government Pleader",
      "Deputy Commissioner (Revenue)"
    ],
    targetCompletionDate: reviewedCase.judgmentDate || null
  };
};

module.exports = {
  buildDemoExtractedData,
  buildDemoActionPlan,
};
