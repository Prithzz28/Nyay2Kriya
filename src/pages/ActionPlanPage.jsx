import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ActionPlanCard } from "../components/actionplan/ActionPlanCard";
import { useToast } from "../hooks/useToast";
import { generateCaseActionPlan } from "../services/api";
import { useAppStore } from "../store/useAppStore";

export const ActionPlanPage = () => {
  const navigate = useNavigate();
  const { caseId } = useParams();
  const toast = useToast();

  const getCaseById = useAppStore((state) => state.getCaseById);
  const setActionPlan = useAppStore((state) => state.setActionPlan);
  const toggleChecklistItem = useAppStore((state) => state.toggleChecklistItem);

  const caseRecord = getCaseById(caseId);
  const [loading, setLoading] = useState(false);

  if (!caseRecord) {
    return (
      <div className="state-card warning">
        <h3>Case Not Found</h3>
        <p>Return to upload and process a case before generating an action plan.</p>
      </div>
    );
  }

  const reviewedCase = caseRecord.reviewedData || caseRecord.extractedData;

  const handleGenerate = async () => {
    setLoading(true);

    try {
      const plan = await generateCaseActionPlan({
        reviewedCase,
        demoMode: caseRecord.demoMode,
      });
      setActionPlan(caseId, plan);
      toast.success("Action plan generated");
    } catch (error) {
      toast.error(error.message || "Failed to generate action plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-content">
      <div className="page-banner">
        <div className="page-banner-eyebrow">Action planning</div>
        <h2>Action Planning Console</h2>
        <p className="subtle-copy">Generate and track legal operations tasks from the approved judgment record.</p>
      </div>

      <section className="card compact-card">
        <div className="button-row">
          <button type="button" className="btn primary" onClick={handleGenerate} disabled={loading}>
            {loading ? "Generating..." : "Generate Action Plan"}
          </button>
          <button type="button" className="btn secondary" onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </button>
        </div>
      </section>

      {caseRecord.actionPlan ? (
        <ActionPlanCard
          plan={caseRecord.actionPlan}
          checklist={caseRecord.checklist}
          onToggle={(key) => toggleChecklistItem(caseId, key)}
        />
      ) : (
        <div className="state-card neutral">
          <p>No action plan generated yet. Use the button above to proceed.</p>
        </div>
      )}
    </section>
  );
};
