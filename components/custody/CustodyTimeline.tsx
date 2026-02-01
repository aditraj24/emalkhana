"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type CustodyLog = {
  _id: string;
  fromLocation: string;
  toLocation: string;
  purpose: string;
  remarks: string;
  dateTime: string;
};

export default function CustodyTimeline() {
  const params = useSearchParams();
  const propertyId = params.get("propertyId");

  const [logs, setLogs] = useState<CustodyLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!propertyId) return;

    fetch(`/api/custody?propertyId=${propertyId}`)
      .then((r) => r.json())
      .then(setLogs)
      .finally(() => setLoading(false));
  }, [propertyId]);

  if (!propertyId) {
    return (
      <p className="text-center text-[#94A3B8]">
        Select a property to view custody
      </p>
    );
  }

  if (loading) {
    return <p className="text-center text-[#94A3B8]">Loading custody...</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold text-[#334155] mb-4">
        Custody Timeline
      </h2>

      {logs.length === 0 ? (
        <p className="text-sm text-[#94A3B8]">No custody logs found</p>
      ) : (
        <ol className="border-l-2 border-[#D5C58A] pl-4 space-y-4">
          {logs.map((log) => (
            <li key={log._id}>
              <p className="font-medium text-sm">
                {log.fromLocation} → {log.toLocation}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(log.dateTime).toLocaleString()} | {log.purpose}
              </p>
              {log.remarks && (
                <p className="text-xs text-gray-600 mt-1">
                  {log.remarks}
                </p>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
