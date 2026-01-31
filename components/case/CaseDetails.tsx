"use client";

import { useEffect, useState } from "react";
import QRPreview from "@/components/property/QRPreview";

type Property = {
  _id: string;
  category: string;
  nature: string;
  quantity: string;
  location: string;
  description: string;
  qrCode: string;
};

export default function CaseDetails({ caseId }: { caseId: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/case/${caseId}`).then((r) => r.json()),
      fetch(`/api/property?caseId=${caseId}`).then((r) => r.json())
    ]).then(([caseData, properties]) => {
      setData({ ...caseData, properties });
      setLoading(false);
    });
  }, [caseId]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded shadow text-center text-[#94A3B8]">
        Loading case details...
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white p-6 rounded shadow">
      {/* Case Info */}
      <div>
        <h2 className="text-xl font-semibold text-[#334155] mb-2">
          Case Details
        </h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <p><b>Crime No:</b> {data.crimeNumber}</p>
          <p><b>Year:</b> {data.crimeYear}</p>
          <p><b>Police Station:</b> {data.policeStation}</p>
          <p><b>Officer:</b> {data.investigatingOfficerName}</p>
          <p><b>Status:</b> {data.status}</p>
        </div>
      </div>

      {/* Properties */}
      <div>
        <h2 className="text-xl font-semibold text-[#334155] mb-2">
          Seized Properties
        </h2>

        {data.properties.length === 0 ? (
          <p className="text-sm text-[#94A3B8]">No properties found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.properties.map((p: Property) => (
              <div
                key={p._id}
                className="border rounded p-4 bg-[#f8fafc]"
              >
                <p><b>Category:</b> {p.category}</p>
                <p><b>Nature:</b> {p.nature}</p>
                <p><b>Qty:</b> {p.quantity}</p>
                <p><b>Location:</b> {p.location}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {p.description}
                </p>

                <div className="mt-3">
                  <QRPreview qrCode={p.qrCode} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
