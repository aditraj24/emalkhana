"use client";

import { useEffect, useState } from "react";

type Alert = {
  _id: string;
  message: string;
  createdAt: string;
};

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => {
        setAlerts(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="mt-8 bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-semibold text-[#334155]">
          Alerts & Notifications
        </h3>
      </div>

      {loading ? (
        <div className="p-6 text-sm text-gray-400">Loading alerts...</div>
      ) : alerts.length === 0 ? (
        <div className="p-6 text-sm text-gray-500">
          No alerts at the moment
        </div>
      ) : (
        <ul className="divide-y">
          {alerts.map((alert) => (
            <li
              key={alert._id}
              className="px-6 py-3 flex justify-between text-sm"
            >
              <span className="text-[#334155]">{alert.message}</span>
              <span className="text-[#94A3B8]">
                {new Date(alert.createdAt).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
