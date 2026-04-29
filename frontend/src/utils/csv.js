import { formatDisplayDate } from "./formatters";

export const exportApprovedCasesCsv = (cases) => {
  const headers = [
    "Case ID",
    "Case Number",
    "Court",
    "Judgment Date",
    "Petitioner",
    "Respondent",
    "Urgency",
    "Status",
  ];

  const rows = cases.map((item) => [
    item.id,
    item.reviewedData?.caseNumber || item.extractedData?.caseNumber || "",
    item.reviewedData?.court || item.extractedData?.court || "",
    formatDisplayDate(item.reviewedData?.judgmentDate || item.extractedData?.judgmentDate),
    item.reviewedData?.petitioner || item.extractedData?.petitioner || "",
    item.reviewedData?.respondent || item.extractedData?.respondent || "",
    item.reviewedData?.urgency || item.extractedData?.urgency || "",
    item.status,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((field) => `"${String(field).replaceAll("\"", "\"\"")}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `approved-cases-${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
