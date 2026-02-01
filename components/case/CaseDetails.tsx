"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

type CaseData = {
  _id: string;
  crimeNumber: string;
  year: number;
  policeStation: string;
  firDate?: string;
  seizureDate?: string;
  actLaw?: string;
  sections?: string[];
  investigatingOfficer?: {
    name: string;
    officerId: string;
  };
  investigatingOfficerId?: string;
  status: "PENDING" | "DISPOSED";
  properties: Property[];
};

export default function CaseDetails({ caseId }: { caseId: string }) {
  const [data, setData] = useState<CaseData | null>(null);
  const [loading, setLoading] = useState(true);

  const khakiPrimary = "#D4B483";
  const navyDark = "#0f172a";

  useEffect(() => {
    Promise.all([
      fetch(`/api/case/${caseId}`).then((r) => r.json()),
      fetch(`/api/property?caseId=${caseId}`).then((r) => r.json()),
    ])
      .then(([caseData, properties]) => {
        setData({ ...caseData, properties });
      })
      .finally(() => setLoading(false));
  }, [caseId]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
            style={{ borderColor: khakiPrimary }}
          ></div>
          <p className="text-gray-500">Loading case details...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-xl shadow p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-red-50">
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
          Case Not Found
        </h3>
        <p className="text-gray-500">The requested case could not be loaded.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: navyDark }}>
                Case: {data.crimeNumber}
              </h1>
              <p className="text-gray-500 mt-1">Year: {data.year}</p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${data.status === "DISPOSED" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}
              >
                {data.status}
              </span>
              
            </div>
          </div>
        </div>

        {/* Case Information Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Case Information
                </h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500">Crime Number</p>
                    <p className="font-medium">{data.crimeNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Police Station</p>
                    <p className="font-medium">{data.policeStation}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Act / Law</p>
                    <p className="font-medium">{data.actLaw || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Dates
                </h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500">FIR Date</p>
                    <p className="font-medium">
                      {data.firDate
                        ? new Date(data.firDate).toLocaleDateString("en-GB")
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Seizure Date</p>
                    <p className="font-medium">
                      {data.seizureDate
                        ? new Date(data.seizureDate).toLocaleDateString("en-GB")
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Year</p>
                    <p className="font-medium">{data.year}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Officer Details
                </h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500">
                      Investigating Officer
                    </p>
                    <p className="font-medium">
                      {data.investigatingOfficer?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Officer ID</p>
                    <p className="font-medium">
                      {data.investigatingOfficer?.officerId ||
                        data.investigatingOfficerId ||
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Sections</p>
                    <p className="font-medium">
                      {data.sections && data.sections.length > 0
                        ? data.sections.join(", ")
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Properties Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold" style={{ color: navyDark }}>
              Seized Properties
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({data.properties.length} items)
              </span>
            </h2>
            
          </div>
        </div>

        <div className="p-6">
          {data.properties.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-gray-100">
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
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No Properties
              </h3>
              <p className="text-gray-500">
                No properties have been added to this case yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.properties.map((property) => (
                <div
                  key={property._id}
                  className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {property.category}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {property.nature}
                        </p>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                        Qty: {property.quantity}
                      </span>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="font-medium">{property.location}</p>
                      </div>
                      {property.description && (
                        <div>
                          <p className="text-xs text-gray-500">Description</p>
                          <p className="text-gray-700 line-clamp-2">
                            {property.description}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500 mb-2">QR Code</p>
                          <QRPreview qrCode={property.qrCode} />
                        </div>
                        <Link
                          href={`/property/${property._id}`}
                          className="text-sm font-medium hover:underline flex items-center gap-0.5"
                          style={{ color: navyDark }}
                        >
                          View Details
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
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="text-sm text-gray-500">Case ID: {data._id}</div>
          <div className="flex gap-3">
            <Link
              href="/cases"
              className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Back to Cases
            </Link>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors flex items-center gap-2"
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
          </div>
        </div>
      </div>
    </div>
  );
}
