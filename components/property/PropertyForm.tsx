"use client";

import { useState } from "react";

type Props = {
  caseId: string;
  onSuccess?: () => void;
};

export default function PropertyForm({ caseId, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    category: "",
    belongsTo: "ACCUSED",
    nature: "",
    quantity: "",
    location: "",
    description: "",
    imageBase64: ""
  });

  const toBase64 = (file: File) =>
    new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

  const submit = async () => {
    if (!caseId) {
      alert("Case ID missing");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/property", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, caseId })
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.error || "Failed to add property");
      return;
    }

    alert("Property added successfully");
    setForm({
      category: "",
      belongsTo: "ACCUSED",
      nature: "",
      quantity: "",
      location: "",
      description: "",
      imageBase64: ""
    });

    onSuccess?.();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
      <h2 className="text-lg font-semibold text-[#334155] mb-4">
        Add Property
      </h2>

      <input
        placeholder="Category"
        className="input"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      />

      <select
        className="input"
        value={form.belongsTo}
        onChange={(e) => setForm({ ...form, belongsTo: e.target.value })}
      >
        <option value="ACCUSED">Accused</option>
        <option value="COMPLAINANT">Complainant</option>
        <option value="UNKNOWN">Unknown</option>
      </select>

      <input
        placeholder="Nature of Property"
        className="input"
        value={form.nature}
        onChange={(e) => setForm({ ...form, nature: e.target.value })}
      />

      <input
        placeholder="Quantity"
        className="input"
        value={form.quantity}
        onChange={(e) => setForm({ ...form, quantity: e.target.value })}
      />

      <input
        placeholder="Location (Rack / Room / Locker)"
        className="input"
        value={form.location}
        onChange={(e) => setForm({ ...form, location: e.target.value })}
      />

      <textarea
        placeholder="Description"
        className="input"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <input
        type="file"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setForm({ ...form, imageBase64: await toBase64(file) });
        }}
      />

      <button
        onClick={submit}
        disabled={loading}
        className="
          bg-[#334155] text-white px-4 py-2 rounded mt-4
          hover:bg-[#1e293b] disabled:opacity-50
        "
      >
        {loading ? "Saving..." : "Add Property"}
      </button>
    </div>
  );
}
