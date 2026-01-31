"use client";

import { useState } from "react";

export default function DisposalForm() {
  const [form, setForm] = useState({
    caseId: "",
    disposalType: "RETURNED",
    courtOrderRef: "",
    disposalDate: "",
    remarks: ""
  });

  const submit = async () => {
    const res = await fetch("/api/disposal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to dispose case");
      return;
    }

    alert("Case disposed successfully");
    window.location.href = "/cases";
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold text-[#334155] mb-4">
        Disposal of Property
      </h2>

      <input
        placeholder="Case ID"
        className="w-full border px-3 py-2 rounded mb-3"
        value={form.caseId}
        onChange={(e) => setForm({ ...form, caseId: e.target.value })}
      />

      <select
        className="w-full border px-3 py-2 rounded mb-3"
        value={form.disposalType}
        onChange={(e) =>
          setForm({ ...form, disposalType: e.target.value })
        }
      >
        <option value="RETURNED">Returned</option>
        <option value="DESTROYED">Destroyed</option>
        <option value="AUCTIONED">Auctioned</option>
        <option value="COURT_CUSTODY">Court Custody</option>
      </select>

      <input
        placeholder="Court Order Reference"
        className="w-full border px-3 py-2 rounded mb-3"
        value={form.courtOrderRef}
        onChange={(e) =>
          setForm({ ...form, courtOrderRef: e.target.value })
        }
      />

      <input
        type="date"
        className="w-full border px-3 py-2 rounded mb-3"
        value={form.disposalDate}
        onChange={(e) =>
          setForm({ ...form, disposalDate: e.target.value })
        }
      />

      <textarea
        placeholder="Remarks"
        className="w-full border px-3 py-2 rounded mb-4"
        value={form.remarks}
        onChange={(e) =>
          setForm({ ...form, remarks: e.target.value })
        }
      />

      <button
        onClick={submit}
        className="bg-[#334155] text-white px-4 py-2 rounded hover:bg-[#1e293b]"
      >
        Submit Disposal
      </button>
    </div>
  );
}
