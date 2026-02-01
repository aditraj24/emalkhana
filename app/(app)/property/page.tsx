"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Property = {
  _id: string;
  category: string;
  nature: string;
  location: string;
  status: string;
};

type Disposed = {
  _id: string;
  disposalType: string;
  courtOrderRef: string;
  createdAt: string;
  propertyId: Property;
};

export default function DisposalPage() {
  const [pending, setPending] = useState<Property[]>([]);
  const [disposed, setDisposed] = useState<Disposed[]>([]);
  const [selected, setSelected] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [disposing, setDisposing] = useState(false);

  const [form, setForm] = useState({
    disposalType: "RETURNED",
    courtOrderRef: "",
    remarks: "",
  });

  const khakiPrimary = "#D4B483";
  const navyDark = "#0f172a";

  useEffect(() => {
    Promise.all([
      fetch("/api/property?status=IN_CUSTODY").then((r) => r.json()),
      fetch("/api/disposal").then((r) => r.json()),
    ])
      .then(([p, d]) => {
        setPending(p);
        setDisposed(d);
      })
      .finally(() => setLoading(false));
  }, []);

  const disposeProperty = async () => {
    if (!selected) return;

    setDisposing(true);
    const res = await fetch("/api/disposal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        propertyId: selected._id,
        ...form,
      }),
    });

    if (res.ok) {
      setPending((prev) => prev.filter((p) => p._id !== selected._id));
      setSelected(null);
      setForm({
        disposalType: "RETURNED",
        courtOrderRef: "",
        remarks: "",
      });
    }
    setDisposing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-3" style={{ borderColor: khakiPrimary }}></div>
          <p className="text-gray-500">Loading disposal data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: navyDark }}>
          Property Disposal
        </h1>
        <p className="text-gray-600 mt-1">Manage property disposal and view disposal history</p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Properties Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                Pending Disposal
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({pending.length})
                </span>
              </h2>
            </div>
          </div>

          <div className="p-6">
            {pending.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-500">No properties pending disposal</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pending.map((p) => (
                  <div
                    key={p._id}
                    className={`p-4 border rounded-lg transition-colors ${
                      selected?._id === p._id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">{p.category}</h3>
                        <p className="text-sm text-gray-600">{p.nature}</p>
                        <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {p.location}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelected(p)}
                          className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                          Dispose
                        </button>
                        <Link
                          href={`/property/${p._id}`}
                          className="px-3 py-1.5 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
                          style={{ color: khakiPrimary }}
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Disposal Form Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              Disposal Form
            </h2>
          </div>

          <div className="p-6">
            {selected ? (
              <div className="space-y-6">
                {/* Selected Property Info */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="font-medium text-gray-800 mb-2">Selected Property</h3>
                  <p className="text-sm text-gray-600">{selected.category} - {selected.nature}</p>
                  <p className="text-xs text-gray-500 mt-1">Location: {selected.location}</p>
                </div>

                {/* Disposal Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Disposal Type
                    </label>
                    <select
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-offset-1 focus:outline-none transition-colors"
                    //   style={{ focusRingColor: khakiPrimary }}
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
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Court Order Reference
                    </label>
                    <input
                      placeholder="Enter court order reference"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-offset-1 focus:outline-none transition-colors"
                    //   style={{ focusRingColor: khakiPrimary }}
                      value={form.courtOrderRef}
                      onChange={(e) =>
                        setForm({ ...form, courtOrderRef: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Remarks
                    </label>
                    <textarea
                      placeholder="Enter disposal remarks"
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-offset-1 focus:outline-none transition-colors resize-none"
                    //   style={{ focusRingColor: khakiPrimary }}
                      value={form.remarks}
                      onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => {
                        setSelected(null);
                        setForm({
                          disposalType: "RETURNED",
                          courtOrderRef: "",
                          remarks: "",
                        });
                      }}
                      className="px-4 py-2.5 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex-1"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={disposeProperty}
                      disabled={disposing}
                      className="px-4 py-2.5 text-sm font-medium rounded-lg text-white transition-colors flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: navyDark }}
                    >
                      {disposing ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Processing...
                        </div>
                      ) : (
                        "Dispose Property"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Property Selected</h3>
                <p className="text-gray-500">Select a property from the list to begin disposal</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Disposed History Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Disposed Properties History
          </h2>
        </div>

        <div className="p-6">
          {disposed.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-gray-500">No disposed properties yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {disposed.map((d) => (
                <Link
                  key={d._id}
                  href={`/property/${d.propertyId._id}`}
                  className="group border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-800 group-hover:text-gray-900">
                      {d.propertyId.category}
                    </h3>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      d.disposalType === "RETURNED" ? "bg-green-100 text-green-800" :
                      d.disposalType === "DESTROYED" ? "bg-red-100 text-red-800" :
                      d.disposalType === "AUCTIONED" ? "bg-amber-100 text-amber-800" :
                      "bg-blue-100 text-blue-800"
                    }`}>
                      {d.disposalType}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{d.propertyId.nature}</p>
                  <div className="text-xs text-gray-500">
                    <p className="mb-1">Ref: {d.courtOrderRef || "N/A"}</p>
                    <p>Disposed: {new Date(d.createdAt).toLocaleDateString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}