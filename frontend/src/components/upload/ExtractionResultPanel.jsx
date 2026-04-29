import { formatCurrency, formatDisplayDate } from "../../utils/formatters";
import { Link } from "react-router-dom";

const booleanLabel = (value) => (value === true ? "Yes" : value === false ? "No" : "-");
const formatTimestamp = (value) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export const ExtractionResultPanel = ({ data, caseId, fileMetadata }) => {
  if (!data) return null;

  const caseSummary = data.caseSummary || {};
  const parties = data.parties || {};
  const keyDirections = data.keyDirections || [];
  const complianceIndicators = data.complianceIndicators || {};
  const riskSignals = data.riskSignals || {};
  const systemMetadata = data.systemMetadata || fileMetadata || {};

  return (
    <section className="card">
      <div className="summary-banner">
        <div>
          <strong>Structured Extraction Result</strong>
          <p>Review the extracted fields before sending the case to human verification.</p>
        </div>
        <div className={`tag ${String(caseSummary.urgencyLevel || data.urgency || "").toLowerCase()}`}>
          {caseSummary.urgencyLevel || data.urgency || "Unrated"}
        </div>
      </div>

      <div className="result-sections">
        <article className="result-section">
          <div className="section-label">Top-Level Case Summary</div>
          <div className="detail-grid">
            <div>
              <label>Case Number</label>
              <p>{caseSummary.caseNumber || data.caseNumber || "-"}</p>
            </div>
            <div>
              <label>Court Name</label>
              <p>{caseSummary.courtName || data.court || "-"}</p>
            </div>
            <div>
              <label>Date of Order</label>
              <p>{formatDisplayDate(caseSummary.dateOfOrder || data.judgmentDate)}</p>
            </div>
            <div>
              <label>Case Type</label>
              <p>{caseSummary.caseType || data.caseType || "-"}</p>
            </div>
            <div>
              <label>Bench</label>
              <p>{caseSummary.bench || data.bench || "-"}</p>
            </div>
            <div>
              <label>Urgency Level</label>
              <p>{caseSummary.urgencyLevel || data.urgency || "-"}</p>
            </div>
          </div>
        </article>

        <article className="result-section">
          <div className="section-label">Parties Involved</div>
          <div className="parties-box">
            <div>
              <label>Petitioner</label>
              <p>{parties.petitioner || data.petitioner || "-"}</p>
            </div>
            <div>
              <label>Respondent</label>
              <p>{parties.respondent || data.respondent || "-"}</p>
            </div>
          </div>
        </article>

        <article className="result-section">
          <div className="section-label">Key Directions</div>
          <div className="table-wrapper compact-table">
            <table className="gov-table result-table">
              <thead>
                <tr>
                  <th>Direction</th>
                  <th>Deadline</th>
                  <th>Responsible Party</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                {keyDirections.length > 0 ? (
                  keyDirections.map((item, index) => (
                    <tr key={`${item.direction}-${index}`}>
                      <td>{item.direction}</td>
                      <td>{item.deadline || "-"}</td>
                      <td>{item.responsibleParty || "-"}</td>
                      <td>
                        <span className={`tag ${String(item.priority || "").toLowerCase()}`}>
                          {item.priority || "-"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4}>No directions extracted.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </article>

        <article className="result-section">
          <div className="section-label">Plain-English Summary</div>
          <p className="summary-text">{data.plainEnglishSummary || data.summary || "-"}</p>
        </article>

        <article className="result-section">
          <div className="section-label">Compliance Indicators</div>
          <div className="detail-grid compact-three">
            <div>
              <label>Compliance Required</label>
              <p>{booleanLabel(complianceIndicators.complianceRequired ?? data.complianceRequired)}</p>
            </div>
            <div>
              <label>Appeal Consideration</label>
              <p>{booleanLabel(complianceIndicators.appealConsideration ?? data.appealConsideration)}</p>
            </div>
            <div>
              <label>Appeal Limitation</label>
              <p>
                {typeof complianceIndicators.appealLimitationDays === "number"
                  ? `${complianceIndicators.appealLimitationDays} days`
                  : typeof data.appealLimitationDays === "number"
                    ? `${data.appealLimitationDays} days`
                    : "-"}
              </p>
            </div>
          </div>
        </article>

        <article className="result-section">
          <div className="section-label">Urgency & Risk Signals</div>
          <div className="detail-grid compact-three">
            <div>
              <label>Urgency Level</label>
              <p>{riskSignals.urgencyLevel || caseSummary.urgencyLevel || data.urgency || "-"}</p>
            </div>
            <div>
              <label>Risk Indicator</label>
              <p>{riskSignals.riskIndicator || data.riskIndicator || "-"}</p>
            </div>
            <div>
              <label>Compensation</label>
              <p>{formatCurrency(data.compensationAmount)}</p>
            </div>
          </div>
        </article>

        <article className="result-section">
          <div className="section-label">Confidence Notes</div>
          <ul className="ordered-list compact">
            {(data.confidenceNotes || []).length > 0 ? (
              data.confidenceNotes.map((note, index) => <li key={`${note}-${index}`}>{note}</li>)
            ) : (
              <li>No confidence notes returned.</li>
            )}
          </ul>
        </article>

        <article className="result-section">
          <div className="section-label">System Metadata</div>
          <div className="detail-grid compact-three">
            <div>
              <label>File Name</label>
              <p>{systemMetadata.fileName || "-"}</p>
            </div>
            <div>
              <label>Pages Count</label>
              <p>{typeof systemMetadata.pageCount === "number" ? systemMetadata.pageCount : "-"}</p>
            </div>
            <div>
              <label>Extraction Timestamp</label>
              <p>{formatTimestamp(systemMetadata.extractionTimestamp)}</p>
            </div>
          </div>
        </article>
      </div>

      <div className="result-actions">
        <Link to={caseId ? `/review/${caseId}` : "/upload"} className="btn secondary">
          Review & Edit
        </Link>
        <Link to={caseId ? `/action/${caseId}` : "/upload"} className="btn primary">
          Generate Action Plan
        </Link>
      </div>
    </section>
  );
};
