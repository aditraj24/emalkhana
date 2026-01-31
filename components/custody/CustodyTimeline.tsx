"use client";

import { useEffect, useState } from "react";

type Custody = {
  _id: string;
  from: string;
  to: string;
  purpose: string;
  remarks: string;
  createdAt: string;
};

export default function CustodyTimeline() {
  const [logs, setLogs] = useState<Custody[]>([]);
  const [propertyId, setPropertyId] = useState("");

  const fetchLogs = async () => {
    if (!propertyId) return;
    const res = await fetch(`/api/custody?propertyId=${propertyId}`);
    const data = await res.json();
    setLogs(data);
  };

  useEffect(() => {
    fetchLogs();
  }, [propertyId]);

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold text-[#334155] mb-4">
        Custody Timeline
      </h2>

      <input
        placeholder="Enter Property ID"
        className="w-full border px-3 py-2 rounded mb-4"
        value={propertyId}
        onChange={(e) => setPropertyId(e.target.value)}
      />

      {logs.length === 0 ? (
        <p className="text-sm text-[#94A3B8]">No custody logs found</p>
      ) : (
        <ol className="border-l border-[#94A3B8] pl-4 space-y-4">
          {logs.map((log) => (
            <li key={log._id}>
              <div className="text-sm">
                <p><b>From:</b> {log.from}</p>
                <p><b>To:</b> {log.to}</p>
                <p><b>Purpose:</b> {log.purpose}</p>
                <p className="text-[#94A3B8] text-xs">
                  {new Date(log.createdAt).toLocaleString()}
                </p>
                <p className="text-sm mt-1">{log.remarks}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
