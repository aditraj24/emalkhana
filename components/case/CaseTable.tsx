"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type Case = {
  _id: string;
  crimeNumber: string;
  year: number;
  policeStation: string;
  investigatingOfficer?: {
    name: string;
  };
  status: "PENDING" | "DISPOSED";
  createdAt: string;
};

export default function CaseTable() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  useEffect(() => {
    setLoading(true);
    setError("");

    fetch(`/api/case?search=${encodeURIComponent(query)}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch cases");
        return data;
      })
      .then((data) => {
        setCases(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [query]);

  if (loading) {
    return <div className="bg-white p-6 rounded shadow text-center text-[#94A3B8]">Loading cases...</div>;
  }

  if (error) {
    return <div className="bg-white p-6 rounded shadow text-center text-red-500">{error}</div>;
  }

  if (cases.length === 0) {
    return <div className="bg-white p-6 rounded shadow text-center text-[#94A3B8]">No cases found</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-[#334155] text-white">
          <tr>
            <th className="px-4 py-3">Crime No</th>
            <th className="px-4 py-3">Year</th>
            <th className="px-4 py-3">Police Station</th>
            <th className="px-4 py-3">Officer</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>

        <tbody>
          {cases.map((c) => (
            <tr key={c._id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3 font-medium">{c.crimeNumber}</td>
              <td className="px-4 py-3">{c.year}</td>
              <td className="px-4 py-3">{c.policeStation}</td>
              <td className="px-4 py-3">{c.investigatingOfficer?.name || "N/A"}</td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    c.status === "DISPOSED"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {c.status}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/cases/${c._id}`}
                  className="text-[#334155] hover:underline font-medium"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
