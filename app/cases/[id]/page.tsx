"use client";

import { generateCaseReport } from "@/utils/generateCaseReport";

export default function PrintButton({ caseId }: { caseId: string }) {
  const handlePrint = async () => {
    const res = await fetch(`/api/reports/case/${caseId}`);
    const data = await res.json();
    generateCaseReport(data);
  };

  return (
    <button onClick={handlePrint}>
      📄 Export / Print Report
    </button>
  );
}
