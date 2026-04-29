import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LivePreviewPanel } from "../components/review/LivePreviewPanel";
import { ReviewForm } from "../components/review/ReviewForm";
import { useToast } from "../hooks/useToast";
import { useAppStore } from "../store/useAppStore";
import { validateReviewedCase } from "../utils/validation";

export const ReviewPage = () => {
  const navigate = useNavigate();
  const { caseId } = useParams();
  const toast = useToast();

  const getCaseById = useAppStore((state) => state.getCaseById);
  const saveDraft = useAppStore((state) => state.saveDraft);
  const updateReviewedCase = useAppStore((state) => state.updateReviewedCase);
  const markCaseDecision = useAppStore((state) => state.markCaseDecision);

  const caseRecord = getCaseById(caseId);

  const startingData = useMemo(() => {
    return caseRecord?.reviewedData || caseRecord?.extractedData || null;
  }, [caseRecord]);

  const [reviewedCase, setReviewedCase] = useState(startingData);
  const [reviewerNotes, setReviewerNotes] = useState(caseRecord?.reviewerNotes || "");

  if (!caseRecord || !reviewedCase) {
    return (
      <div className="state-card warning">
        <h3>Case Not Found</h3>
        <p>Return to upload and process a judgment first.</p>
      </div>
    );
  }

  const onSaveDraft = () => {
    saveDraft(caseId, reviewedCase, reviewerNotes);
    toast.info("Draft saved");
  };

  const onReject = () => {
    updateReviewedCase(caseId, reviewedCase, reviewerNotes);
    markCaseDecision(caseId, "Rejected");
    toast.warning("Case marked as rejected");
    navigate("/dashboard");
  };

  const onApprove = () => {
    const errors = validateReviewedCase(reviewedCase);

    if (errors.length > 0) {
      toast.error(errors[0]);
      return;
    }

    updateReviewedCase(caseId, reviewedCase, reviewerNotes);
    markCaseDecision(caseId, "Approved");
    toast.success("Case approved for action planning");
    navigate(`/action/${caseId}`);
  };

  return (
    <section className="page-content">
      <div className="page-banner">
        <div className="page-banner-eyebrow">Human review</div>
        <h2>Human Review and Verification</h2>
        <p className="subtle-copy">Validate extracted fields, edit legal directions, and approve the case for action planning.</p>
      </div>

      <div className="split-two">
        <div>
          <ReviewForm
            reviewedCase={reviewedCase}
            setReviewedCase={setReviewedCase}
            reviewerNotes={reviewerNotes}
            setReviewerNotes={setReviewerNotes}
          />
          <div className="button-row">
            <button type="button" className="btn secondary" onClick={onSaveDraft}>
              Save Draft
            </button>
            <button type="button" className="btn danger" onClick={onReject}>
              Reject
            </button>
            <button type="button" className="btn success" onClick={onApprove}>
              Approve and Continue
            </button>
          </div>
        </div>
        <LivePreviewPanel data={reviewedCase} reviewerNotes={reviewerNotes} />
      </div>
    </section>
  );
};
