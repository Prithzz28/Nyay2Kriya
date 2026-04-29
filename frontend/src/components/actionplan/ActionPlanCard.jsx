export const ActionPlanCard = ({ plan, checklist, onToggle }) => {
  if (!plan) return null;

  const checklistItems = [...(plan.immediateActions || []), ...(plan.complianceSteps || [])];

  return (
    <section className="card">
      <h3>Operational Action Plan</h3>
      <div className="plan-grid">
        <article>
          <h4>Immediate Actions</h4>
          <ul className="ordered-list">
            {plan.immediateActions?.map((item, index) => (
              <li key={`immediate-${index}`}>{item}</li>
            ))}
          </ul>
        </article>
        <article>
          <h4>Compliance Steps</h4>
          <ul className="ordered-list">
            {plan.complianceSteps?.map((item, index) => (
              <li key={`compliance-${index}`}>{item}</li>
            ))}
          </ul>
        </article>
      </div>

      <div className="state-card warning">
        <strong>Appeal Recommendation:</strong> {plan.appealRecommendation}
      </div>
      <div className="state-card neutral">
        <strong>Risk Summary:</strong> {plan.riskSummary}
      </div>

      <h4>Checklist Progress</h4>
      <div className="checklist-list">
        {checklistItems.map((item, index) => {
          const key = `${index}-${item}`;

          return (
            <label className="check-item" key={key}>
              <input
                type="checkbox"
                checked={Boolean(checklist?.[key])}
                onChange={() => onToggle(key)}
              />
              <span>{item}</span>
            </label>
          );
        })}
      </div>
    </section>
  );
};
