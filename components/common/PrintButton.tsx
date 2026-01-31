"use client";

export default function PrintButton({ caseId }: { caseId: string }) {
  return (
    <div className="flex justify-end mb-4">
      <button
        onClick={() => window.print()}
        className="
          bg-[#334155] text-white px-4 py-2 rounded
          hover:bg-[#1e293b] transition
        "
      >
        🖨️ Print Report
      </button>
    </div>
  );
}
