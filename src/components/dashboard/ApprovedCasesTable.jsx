import { Fragment, useState } from "react";
import { formatCurrency, formatDisplayDate } from "../../utils/formatters";

export const ApprovedCasesTable = ({ cases }) => {
  const [expandedRow, setExpandedRow] = useState(null);

  return (
    <div className="table-wrapper">
      <table className="gov-table">
        <thead>
          <tr>
            <th>Case ID</th>
            <th>Case Number</th>
            <th>Court</th>
            <th>Date</th>
            <th>Urgency</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((item) => {
            const data = item.reviewedData || item.extractedData;
            const isOpen = expandedRow === item.id;

            return (
              <Fragment key={item.id}>
                <tr>
                  <td>{item.id}</td>
                  <td>{data?.caseNumber || "-"}</td>
                  <td>{data?.court || "-"}</td>
                  <td>{formatDisplayDate(data?.judgmentDate)}</td>
                  <td>
                    <span className={`tag ${String(data?.urgency || "").toLowerCase()}`}>
                      {data?.urgency || "-"}
                    </span>
                  </td>
                  <td>
                    <span className="tag">{item.status}</span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn secondary"
                      onClick={() => setExpandedRow(isOpen ? null : item.id)}
                    >
                      {isOpen ? "Hide" : "View"}
                    </button>
                  </td>
                </tr>
                {isOpen && (
                  <tr className="expanded-row">
                    <td colSpan={7}>
                      <div className="expanded-content">
                        <p>
                          <strong>Parties:</strong> {data?.petitioner} vs {data?.respondent}
                        </p>
                        <p>
                          <strong>Compensation:</strong> {formatCurrency(data?.compensationAmount)}
                        </p>
                        <p>
                          <strong>Issue:</strong> {data?.legalIssue}
                        </p>
                        <p>
                          <strong>Action Plan:</strong> {item.actionPlan?.riskSummary || "Not generated"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
