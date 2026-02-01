"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Alert = {
  _id: string;
  message: string;
  createdAt: string;
  caseId?: string;
  propertyId?: string;
};

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const khakiPrimary = "#D4B483";
  const khakiDark = "#B5985C";
  const navyDark = "#0f172a";
  const navyLight = "#1e293b";

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch("/api/notification");
        const data = await res.json();
        setAlerts(data);
      } catch (error) {
        console.error("Failed to fetch alerts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
    // Refresh alerts every 30 seconds
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAlertClick = (alert: Alert) => {
    if (alert.caseId) {
      router.push(`/cases/${alert.caseId}`);
    } else if (alert.propertyId) {
      router.push(`/property/${alert.propertyId}`);
    }
  };

  const extractAlertType = (message: string): string => {
    if (message.toLowerCase().includes("case")) return "case";
    if (
      message.toLowerCase().includes("property") ||
      message.toLowerCase().includes("item")
    )
      return "property";
    return "general";
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "case":
        return (
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        );
      case "property":
        return (
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
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        );
      default:
        return (
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
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  return (
    <div className="rounded-2xl shadow-lg overflow-hidden border border-gray-200">
      {/* Header */}
      <div
        className="px-6 py-4 border-b"
        style={{
          background: `linear-gradient(90deg, ${navyLight} 0%, ${navyDark} 100%)`,
        }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            Alerts & Notifications
          </h3>
          <span className="text-xs px-2 py-1 rounded-full bg-white/20 text-white">
            {alerts.length} total
          </span>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="p-8 flex flex-col items-center justify-center">
          <div
            className="animate-spin rounded-full h-8 w-8 border-b-2"
            style={{ borderColor: khakiPrimary }}
          ></div>
          <p className="mt-3 text-gray-500">Loading alerts...</p>
        </div>
      ) : alerts.length === 0 ? (
        <div className="p-8 text-center">
          <div
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${khakiPrimary}15` }}
          >
            <svg
              className="w-8 h-8"
              style={{ color: khakiPrimary }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-gray-700">
            All caught up!
          </h4>
          <p className="text-gray-500 mt-1">No new alerts at the moment.</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {alerts.map((alert) => {
            const alertType = extractAlertType(alert.message);
            const isClickable = alert.caseId || alert.propertyId;

            return (
              <li
                key={alert._id}
                className={`
                  px-6 py-4 transition-all duration-200 hover:bg-gray-50 
                  ${isClickable ? "cursor-pointer group" : ""}
                `}
                onClick={() => isClickable && handleAlertClick(alert)}
              >
                <div className="flex items-start gap-3">
                  {/* Alert Icon */}
                  <div
                    className={`
                      mt-0.5 p-2 rounded-lg flex-shrink-0
                      ${
                        alertType === "case"
                          ? "bg-blue-50"
                          : alertType === "property"
                            ? "bg-emerald-50"
                            : "bg-amber-50"
                      }
                    `}
                  >
                    <div
                      className={`
                      ${
                        alertType === "case"
                          ? "text-blue-600"
                          : alertType === "property"
                            ? "text-emerald-600"
                            : "text-amber-600"
                      }
                    `}
                    >
                      {getAlertIcon(alertType)}
                    </div>
                  </div>

                  {/* Alert Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 group-hover:text-gray-900 font-medium">
                      {alert.message}
                      {isClickable && (
                        <span
                          className="ml-2 inline-flex items-center gap-1 text-xs font-normal opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ color: khakiPrimary }}
                        >
                          View details
                          <svg
                            className="w-3 h-3"
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
                        </span>
                      )}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {new Date(alert.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs text-gray-500">
                        {new Date(alert.createdAt).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Alert Type Badge */}
                  <div className="hidden sm:block">
                    <span
                      className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${
                        alertType === "case"
                          ? "bg-blue-100 text-blue-800"
                          : alertType === "property"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                      }
                    `}
                    >
                      {alertType.charAt(0).toUpperCase() + alertType.slice(1)}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      
    </div>
  );
}
