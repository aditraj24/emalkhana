"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function CustodyForm() {
  const params = useSearchParams();
  const propertyId = params.get("propertyId") || "";

  const [form, setForm] = useState({
    propertyId: "",
    toLocation: "",
    purpose: "",
    remarks: ""
  });

  useEffect(() => {
    if (propertyId) {
      setForm((f) => ({ ...f, propertyId }));
    }
  }, [propertyId]);

  const submit = async () => {
    if (!form.propertyId) {
      alert("PropertyId missing");
      return;
    }

    const res = await fetch("/api/custody", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to add custody");
      return;
    }

    alert("Custody movement recorded");
    window.location.reload();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold text-[#334155] mb-4">
        Add Custody Movement
      </h2>

      <input
        value={form.propertyId}
        disabled
        className="w-full border px-3 py-2 rounded mb-3 bg-gray-100"
      />

      <input
        placeholder="To Location / Officer"
        className="w-full border px-3 py-2 rounded mb-3"
        value={form.toLocation}
        onChange={(e) =>
          setForm({ ...form, toLocation: e.target.value })
        }
      />

      <input
        placeholder="Purpose (Court / FSL / Storage)"
        className="w-full border px-3 py-2 rounded mb-3"
        value={form.purpose}
        onChange={(e) =>
          setForm({ ...form, purpose: e.target.value })
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
        Save Custody
      </button>
    </div>
  );
}
