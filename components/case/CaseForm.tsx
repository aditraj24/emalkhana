"use client";

import { useState } from "react";
import QRPreview from "@/components/property/QRPreview";

type Property = {
  category: string;
  belongsTo: string;
  nature: string;
  quantity: string;
  location: string;
  description: string;
  imageBase64?: string;
  qrCode?: string;
};

export default function CaseForm() {
  const [step, setStep] = useState(1);
  const [caseId, setCaseId] = useState<string | null>(null);

  const [caseData, setCaseData] = useState<any>({
    policeStation: "",
    investigatingOfficerName: "",
    investigatingOfficerId: "",
    crimeNumber: "",
    crimeYear: "",
    firDate: "",
    seizureDate: "",
    actLaw: "",
    sectionLaw: ""
  });

  const [properties, setProperties] = useState<Property[]>([]);
  const [currentProperty, setCurrentProperty] = useState<Property>({
    category: "",
    belongsTo: "ACCUSED",
    nature: "",
    quantity: "",
    location: "",
    description: ""
  });

  const next = () => setStep(step + 1);
  const prev = () => setStep(step - 1);

  // ---------- STEP 1: CREATE CASE ----------
  const createCase = async () => {
    const res = await fetch("/api/case", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(caseData)
    });

    const data = await res.json();
    setCaseId(data._id);
    next();
  };

  // ---------- STEP 2: ADD PROPERTY ----------
  const addProperty = async () => {
  if (!caseId) {
    alert("Case not created yet");
    return;
  }

  const res = await fetch("/api/property", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...currentProperty, caseId })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error);
    console.error(data);
    return;
  }

  setProperties(prev => [...prev, data]);
};


  // ---------- FILE TO BASE64 ----------
  const toBase64 = (file: File) =>
    new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-4xl mx-auto">
      {/* STEP INDICATOR */}
      <div className="flex justify-between mb-6 text-sm">
        <span className={step === 1 ? "font-bold text-[#334155]" : ""}>
          1. Case Details
        </span>
        <span className={step === 2 ? "font-bold text-[#334155]" : ""}>
          2. Property Entry
        </span>
        <span className={step === 3 ? "font-bold text-[#334155]" : ""}>
          3. QR Confirmation
        </span>
      </div>

      {/* ================= STEP 1 ================= */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[#334155]">Case Details</h2>

          {Object.keys(caseData).map((key) => (
            <input
              key={key}
              placeholder={key.replace(/([A-Z])/g, " $1")}
              className="w-full border px-3 py-2 rounded"
              value={caseData[key]}
              onChange={(e) =>
                setCaseData({ ...caseData, [key]: e.target.value })
              }
            />
          ))}

          <button
            onClick={createCase}
            className="bg-[#334155] text-white px-4 py-2 rounded"
          >
            Save & Continue
          </button>
        </div>
      )}

      {/* ================= STEP 2 ================= */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[#334155]">Add Property</h2>

          <input
            placeholder="Category"
            className="input"
            value={currentProperty.category}
            onChange={(e) =>
              setCurrentProperty({ ...currentProperty, category: e.target.value })
            }
          />

          <select
            className="input"
            value={currentProperty.belongsTo}
            onChange={(e) =>
              setCurrentProperty({ ...currentProperty, belongsTo: e.target.value })
            }
          >
            <option value="ACCUSED">Accused</option>
            <option value="COMPLAINANT">Complainant</option>
            <option value="UNKNOWN">Unknown</option>
          </select>

          <input
            placeholder="Nature of Property"
            className="input"
            value={currentProperty.nature}
            onChange={(e) =>
              setCurrentProperty({ ...currentProperty, nature: e.target.value })
            }
          />

          <input
            placeholder="Quantity"
            className="input"
            value={currentProperty.quantity}
            onChange={(e) =>
              setCurrentProperty({ ...currentProperty, quantity: e.target.value })
            }
          />

          <input
            placeholder="Location"
            className="input"
            value={currentProperty.location}
            onChange={(e) =>
              setCurrentProperty({ ...currentProperty, location: e.target.value })
            }
          />

          <textarea
            placeholder="Description"
            className="input"
            value={currentProperty.description}
            onChange={(e) =>
              setCurrentProperty({
                ...currentProperty,
                description: e.target.value
              })
            }
          />

          <input
            type="file"
            onChange={async (e) =>
              setCurrentProperty({
                ...currentProperty,
                imageBase64: await toBase64(e.target.files![0])
              })
            }
          />

          <button
            onClick={addProperty}
            className="bg-[#334155] text-white px-4 py-2 rounded"
          >
            Add Property
          </button>

          {properties.length > 0 && (
            <button
              onClick={next}
              className="bg-[#D5C58A] px-4 py-2 rounded ml-4"
            >
              Finish
            </button>
          )}
        </div>
      )}

      {/* ================= STEP 3 ================= */}
      {step === 3 && (
        <div>
          <h2 className="text-xl font-semibold text-[#334155] mb-4">
            QR Codes Generated
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {properties.map((p, i) => (
              <QRPreview key={i} qrCode={p.qrCode!} />
            ))}
          </div>

          <button
            onClick={() => (window.location.href = "/cases")}
            className="mt-6 bg-[#334155] text-white px-4 py-2 rounded"
          >
            Go to Case List
          </button>
        </div>
      )}
    </div>
  );
}
