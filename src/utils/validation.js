export const validateReviewedCase = (reviewedCase) => {
  const errors = [];

  if (!reviewedCase.caseNumber) errors.push("Case number is required");
  if (!reviewedCase.court) errors.push("Court name is required");
  if (!reviewedCase.judgmentDate) errors.push("Judgment date is required");
  if (!reviewedCase.petitioner) errors.push("Petitioner is required");
  if (!reviewedCase.respondent) errors.push("Respondent is required");
  if (!Array.isArray(reviewedCase.directions) || reviewedCase.directions.length === 0) {
    errors.push("At least one judicial direction is required");
  }

  return errors;
};
