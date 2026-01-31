"use client";

import { useState } from "react";

export default function CustodyForm() {
  const [form, setForm] = useState({
    propertyId: "",
    from: "",
    to: "",
    purpose: "",
    remarks: ""
  });

  const submit = async () => {
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
    <div className="bg-white p-6 rounded-lg shadow max-w-3xl mx-auto mb-6">
      <h2 className="text-xl font-semibold text-[#334155] mb-4">
        Add Custody Movement
      </h2>

      {["propertyId", "from", "to", "purpose", "remarks"].map((field) => (
        <input
          key={field}
          placeholder={field.toUpperCase()}
          className="w-full border px-3 py-2 rounded mb-3"
          value={(form as any)[field]}
          onChange={(e) => setForm({ ...form, [field]: e.target.value })}
        />
      ))}

      <button
        onClick={submit}
        className="bg-[#334155] text-white px-4 py-2 rounded hover:bg-[#1e293b]"
      >
        Save Custody
      </button>
    </div>
  );
}
