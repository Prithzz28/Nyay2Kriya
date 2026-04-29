import { useMemo, useState } from "react";
import { ApprovedCasesTable } from "../components/dashboard/ApprovedCasesTable";
import { CaseFilters } from "../components/dashboard/CaseFilters";
import { useAppStore } from "../store/useAppStore";
import { exportApprovedCasesCsv } from "../utils/csv";

export const DashboardPage = () => {
  const cases = useAppStore((state) => state.cases);

  const [filters, setFilters] = useState({
    search: "",
    urgency: "",
    fromDate: "",
    toDate: "",
  });

  const approvedCases = useMemo(() => {
    return cases.filter((item) => item.status === "Approved");
  }, [cases]);

  const filteredCases = useMemo(() => {
    return approvedCases.filter((item) => {
      const data = item.reviewedData || item.extractedData;
      const searchable = `${item.id} ${data?.caseNumber || ""} ${data?.court || ""} ${data?.petitioner || ""} ${data?.respondent || ""}`.toLowerCase();

      if (filters.search && !searchable.includes(filters.search.toLowerCase())) {
        return false;
      }

      if (filters.urgency && data?.urgency !== filters.urgency) {
        return false;
      }

      const caseDate = data?.judgmentDate ? new Date(data.judgmentDate) : null;

      if (filters.fromDate && caseDate && caseDate < new Date(filters.fromDate)) {
        return false;
      }

      if (filters.toDate && caseDate && caseDate > new Date(filters.toDate)) {
        return false;
      }

      return true;
    });
  }, [approvedCases, filters]);

  const highUrgencyCount = filteredCases.filter(
    (item) => (item.reviewedData || item.extractedData)?.urgency === "High"
  ).length;

  const totalCompensation = filteredCases.reduce((sum, item) => {
    const amount = (item.reviewedData || item.extractedData)?.compensationAmount;
    return sum + (typeof amount === "number" ? amount : 0);
  }, 0);

  return (
    <section className="page-content">
      <div className="page-banner">
        <div className="page-banner-top">
          <div>
            <div className="page-banner-eyebrow">Approved matters</div>
            <h2>Approved Case Dashboard</h2>
            <p className="subtle-copy">
              Monitor approved judgments, compliance urgency, and reporting records. This view stays focused on completed work only.
            </p>
          </div>
        </div>

        <div className="stat-grid">
          <article className="stat-card">
            <span className="label">Approved cases</span>
            <span className="value">{approvedCases.length}</span>
          </article>
          <article className="stat-card">
            <span className="label">Visible results</span>
            <span className="value">{filteredCases.length}</span>
          </article>
          <article className="stat-card">
            <span className="label">High urgency</span>
            <span className="value">{highUrgencyCount}</span>
          </article>
          <article className="stat-card">
            <span className="label">Total compensation</span>
            <span className="value">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(totalCompensation)}</span>
          </article>
        </div>
      </div>

      <CaseFilters filters={filters} setFilters={setFilters} />

      <section className="card compact-card">
        <div className="button-row spread">
          <p className="muted">Showing {filteredCases.length} approved case(s)</p>
          <button
            type="button"
            className="btn secondary"
            disabled={filteredCases.length === 0}
            onClick={() => exportApprovedCasesCsv(filteredCases)}
          >
            Export CSV
          </button>
        </div>
      </section>

      {filteredCases.length > 0 ? (
        <ApprovedCasesTable cases={filteredCases} />
      ) : (
        <div className="state-card neutral">
          <h3>No Approved Cases</h3>
          <p>Approve a reviewed case to populate this dashboard.</p>
        </div>
      )}
    </section>
  );
};
