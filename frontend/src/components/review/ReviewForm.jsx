export const ReviewForm = ({ reviewedCase, setReviewedCase, reviewerNotes, setReviewerNotes }) => {
  const setField = (field, value) => {
    setReviewedCase({ ...reviewedCase, [field]: value });
  };

  const addDirection = () => {
    setReviewedCase({
      ...reviewedCase,
      directions: [...(reviewedCase.directions || []), ""],
    });
  };

  const updateDirection = (index, value) => {
    const updated = [...(reviewedCase.directions || [])];
    updated[index] = value;
    setReviewedCase({ ...reviewedCase, directions: updated });
  };

  const removeDirection = (index) => {
    const updated = [...(reviewedCase.directions || [])].filter((_, i) => i !== index);
    setReviewedCase({ ...reviewedCase, directions: updated });
  };

  return (
    <section className="card">
      <h3>Human Verification</h3>
      <div className="form-grid two-col">
        <label>
          Case Number
          <input
            value={reviewedCase.caseNumber || ""}
            onChange={(event) => setField("caseNumber", event.target.value)}
          />
        </label>
        <label>
          Judgment Date
          <input
            type="date"
            value={reviewedCase.judgmentDate || ""}
            onChange={(event) => setField("judgmentDate", event.target.value)}
          />
        </label>
        <label>
          Court
          <input value={reviewedCase.court || ""} onChange={(event) => setField("court", event.target.value)} />
        </label>
        <label>
          Bench
          <input value={reviewedCase.bench || ""} onChange={(event) => setField("bench", event.target.value)} />
        </label>
        <label>
          Petitioner
          <input
            value={reviewedCase.petitioner || ""}
            onChange={(event) => setField("petitioner", event.target.value)}
          />
        </label>
        <label>
          Respondent
          <input
            value={reviewedCase.respondent || ""}
            onChange={(event) => setField("respondent", event.target.value)}
          />
        </label>
        <label>
          Urgency
          <select
            value={reviewedCase.urgency || "Medium"}
            onChange={(event) => setField("urgency", event.target.value)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </label>
        <label>
          Compensation Amount
          <input
            type="number"
            value={reviewedCase.compensationAmount || ""}
            onChange={(event) => setField("compensationAmount", Number(event.target.value))}
          />
        </label>
      </div>

      <label>
        Legal Issue
        <textarea
          rows={3}
          value={reviewedCase.legalIssue || ""}
          onChange={(event) => setField("legalIssue", event.target.value)}
        />
      </label>

      <label>
        Summary
        <textarea
          rows={4}
          value={reviewedCase.summary || ""}
          onChange={(event) => setField("summary", event.target.value)}
        />
      </label>

      <div>
        <div className="list-header">
          <h4>Judicial Directions</h4>
          <button type="button" className="btn secondary" onClick={addDirection}>
            Add Direction
          </button>
        </div>
        {(reviewedCase.directions || []).map((item, index) => (
          <div className="inline-input" key={`direction-${index}`}>
            <textarea rows={2} value={item} onChange={(event) => updateDirection(index, event.target.value)} />
            <button type="button" className="btn danger" onClick={() => removeDirection(index)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <label>
        Reviewer Notes
        <textarea rows={4} value={reviewerNotes} onChange={(event) => setReviewerNotes(event.target.value)} />
      </label>
    </section>
  );
};
