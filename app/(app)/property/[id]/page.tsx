"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import QRPreview from "@/components/property/QRPreview";

type Property = {
  _id: string;
  category: string;
  nature: string;
  quantity: string;
  location: string;
  description: string;
  status: string;
  photoUrl?: string;
  qrCode: string;
  caseId: {
    _id: string;
    crimeNumber: string;
    policeStation: string;
  };
};

type CustodyLog = {
  _id: string;
  fromLocation: string;
  toLocation: string;
  purpose: string;
  dateTime: string;
  remarks: string;
};

export default function PropertyDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [custodyLogs, setCustodyLogs] = useState<CustodyLog[]>([]);
  const [loading, setLoading] = useState(true);

  const khakiPrimary = "#D4B483";
  const navyDark = "#0f172a";

  useEffect(() => {
    Promise.all([
      fetch(`/api/property/${id}`).then((r) => r.json()),
      fetch(`/api/custody?propertyId=${id}`).then((r) => r.json()),
    ])
      .then(([p, logs]) => {
        setProperty(p);
        setCustodyLogs(logs);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-10 w-10 border-b-2 mx-auto mb-4"
            style={{ borderColor: khakiPrimary }}
          ></div>
          <p className="text-gray-500">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="bg-white rounded-xl shadow p-8 text-center max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Property Not Found
        </h3>
        <p className="text-gray-500">
          The requested property could not be loaded.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: navyDark }}>
                Property Details
              </h1>
              <p className="text-gray-500 mt-1">
                {property.category} • {property.nature}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                Print
              </button>
              <a
                href={`/custody?propertyId=${property._id}`}
                className="px-4 py-2.5 text-sm font-medium rounded-lg border transition-colors flex items-center gap-2"
                style={{
                  borderColor: khakiPrimary,
                  color: khakiPrimary,
                  backgroundColor: "rgba(212, 180, 131, 0.1)",
                }}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
                Custody Transfer
              </a>
            </div>
          </div>
        </div>

        {/* Property Information Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Property Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Category</p>
                    <p className="font-medium">{property.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Nature</p>
                    <p className="font-medium">{property.nature}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Quantity</p>
                    <p className="font-medium">{property.quantity}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="font-medium">{property.location}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Case Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Crime Number</p>
                    <p className="font-medium">
                      {property.caseId?.crimeNumber || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Police Station</p>
                    <p className="font-medium">
                      {property.caseId?.policeStation || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                        property.status === "IN_CUSTODY"
                          ? "bg-blue-100 text-blue-800"
                          : property.status === "DISPOSED"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {property.status}
                    </span>
                  </div>
                  {property.description && (
                    <div>
                      <p className="text-xs text-gray-500">Description</p>
                      <p className="text-sm text-gray-700">
                        {property.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Photo and QR Code */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Property Photo */}
        {property.photoUrl && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                Property Photo
              </h3>
            </div>
            <div className="p-6">
              <div className="relative rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={property.photoUrl}
                  alt="Property"
                  className="w-full h-auto object-contain max-h-64"
                />
              </div>
            </div>
          </div>
        )}

        {/* QR Code */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">QR Code</h3>
          </div>
          <div className="p-6">
            <div className="flex flex-col items-center">
              <div className="mb-4">
                <QRPreview qrCode={property.qrCode} />
              </div>
              <p className="text-sm text-gray-500 text-center">
                Scan to view property details
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custody Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              Chain of Custody
            </h3>
            <span className="text-sm text-gray-500">
              {custodyLogs.length} records
            </span>
          </div>
        </div>

        <div className="p-6">
          {custodyLogs.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                No Custody Records
              </h4>
              <p className="text-gray-500">
                No custody transfers recorded for this property.
              </p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

              <div className="space-y-6">
                {custodyLogs.map((log, index) => (
                  <div key={log._id} className="relative flex items-start">
                    {/* Timeline dot */}
                    <div className="absolute left-3 mt-1.5">
                      <div
                        className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: khakiPrimary }}
                      ></div>
                    </div>

                    <div className="ml-10 flex-1">
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-800">
                              {log.fromLocation}
                            </span>
                            <svg
                              className="w-4 h-4 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                            <span className="font-medium text-gray-800">
                              {log.toLocation}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(log.dateTime).toLocaleDateString()} •{" "}
                            {new Date(log.dateTime).toLocaleTimeString()}
                          </span>
                        </div>

                        <div className="text-sm text-gray-600">
                          <p className="font-medium mb-1">{log.purpose}</p>
                          {log.remarks && (
                            <p
                              className="text-gray-500 mt-2 border-l-2 pl-3 py-1"
                              style={{ borderColor: khakiPrimary }}
                            >
                              {log.remarks}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
