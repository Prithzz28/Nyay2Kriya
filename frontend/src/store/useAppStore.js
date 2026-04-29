import { create } from "zustand";

const createId = () => `CASE-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export const useAppStore = create((set, get) => ({
  cases: [],
  ui: {
    sidebarOpen: true,
  },
  toasts: [],

  setSidebarOpen: (sidebarOpen) =>
    set((state) => ({
      ui: { ...state.ui, sidebarOpen },
    })),

  addToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { id: `${Date.now()}-${Math.random()}`, ...toast }],
    })),

  removeToast: (toastId) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== toastId),
    })),

  addExtractedCase: ({ extractedData, sourceText, demoMode }) => {
    const caseId = createId();

    set((state) => ({
      cases: [
        {
          id: caseId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          demoMode,
          status: "Extracted",
          reviewStatus: "Pending",
          sourceText,
          extractedData,
          reviewedData: null,
          reviewerNotes: "",
          actionPlan: null,
          checklist: {},
        },
        ...state.cases,
      ],
    }));

    return caseId;
  },

  updateReviewedCase: (caseId, reviewedData, reviewerNotes) =>
    set((state) => ({
      cases: state.cases.map((item) =>
        item.id === caseId
          ? {
              ...item,
              reviewedData,
              reviewerNotes,
              status: "Reviewed",
              reviewStatus: "In Review",
              updatedAt: new Date().toISOString(),
            }
          : item
      ),
    })),

  markCaseDecision: (caseId, decision) =>
    set((state) => ({
      cases: state.cases.map((item) =>
        item.id === caseId
          ? {
              ...item,
              reviewStatus: decision,
              status: decision === "Approved" ? "Approved" : "Rejected",
              updatedAt: new Date().toISOString(),
            }
          : item
      ),
    })),

  saveDraft: (caseId, reviewedData, reviewerNotes) =>
    set((state) => ({
      cases: state.cases.map((item) =>
        item.id === caseId
          ? {
              ...item,
              reviewedData,
              reviewerNotes,
              status: "Draft",
              updatedAt: new Date().toISOString(),
            }
          : item
      ),
    })),

  setActionPlan: (caseId, actionPlan) =>
    set((state) => ({
      cases: state.cases.map((item) =>
        item.id === caseId
          ? {
              ...item,
              actionPlan,
              checklist: Object.fromEntries(
                [
                  ...(actionPlan.immediateActions || []),
                  ...(actionPlan.complianceSteps || []),
                ].map((step, index) => [`${index}-${step}`, false])
              ),
              updatedAt: new Date().toISOString(),
            }
          : item
      ),
    })),

  toggleChecklistItem: (caseId, key) =>
    set((state) => ({
      cases: state.cases.map((item) =>
        item.id === caseId
          ? {
              ...item,
              checklist: {
                ...item.checklist,
                [key]: !item.checklist[key],
              },
              updatedAt: new Date().toISOString(),
            }
          : item
      ),
    })),

  getCaseById: (caseId) => get().cases.find((item) => item.id === caseId),
}));
