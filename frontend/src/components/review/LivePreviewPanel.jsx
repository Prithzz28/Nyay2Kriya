import { formatCurrency, formatDisplayDate } from "../../utils/formatters";

export const LivePreviewPanel = ({ data, reviewerNotes }) => {
  return (
    <section className="card sticky-panel">
      <h3>Live Preview</h3>
      <p className="mono">{data.caseNumber || "No case number"}</p>
      <div className="preview-row">
        <strong>Court:</strong>
        <span>{data.court || "-"}</span>
      </div>
      <div className="preview-row">
        <strong>Date:</strong>
        <span>{formatDisplayDate(data.judgmentDate)}</span>
      </div>
      <div className="preview-row">
        <strong>Parties:</strong>
        <span>
          {data.petitioner || "-"} vs {data.respondent || "-"}
        </span>
      </div>
      <div className="preview-row">
        <strong>Compensation:</strong>
        <span>{formatCurrency(data.compensationAmount)}</span>
      </div>
      <div>
        <strong>Directions</strong>
        <ul className="ordered-list compact">
          {(data.directions || []).map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ul>
      </div>
      <div>
        <strong>Reviewer Notes</strong>
        <p>{reviewerNotes || "No notes"}</p>
      </div>
    </section>
  );
};
