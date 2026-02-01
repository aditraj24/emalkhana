"use client";

import { useEffect } from "react";
import MetricsCards from "@/components/dashboard/MetricsCards";
import AlertsPanel from "@/components/dashboard/AlertsPanel";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const khakiPrimary = "#D4B483";
  const khakiDark = "#B5985C";
  const navyDark = "#0f172a";
  const navyLight = "#1e293b";

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("/api/cron/pending-cases");
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: navyDark }}>
            Dashboard
          </h1>
          {session?.user?.officerId && (
            <p className="text-gray-600 text-sm mt-1">
              Welcome, <span className="font-semibold">{session.user.officerId}</span>
            </p>
          )}
        </div>

        <div className="flex gap-3">
          {/* New Case */}
          <Link
            href="/cases/new"
            className="
              relative group px-5 py-2.5 rounded-lg
              font-medium text-sm md:text-base
              transition-all duration-300
              overflow-hidden flex items-center justify-center gap-2
              shadow-md hover:shadow-lg
            "
            style={{
              background: `linear-gradient(135deg, ${navyLight} 0%, ${navyDark} 100%)`,
              color: 'white'
            }}
          >
            {/* Button shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            
            <svg 
              className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-semibold">New Case</span>
          </Link>

          {/* Add Officer (ADMIN ONLY) */}
          {session?.user.role === "ADMIN" && (
            <Link
              href="/admin/add-officer"
              className="
                relative group px-5 py-2.5 rounded-lg
                font-medium text-sm md:text-base
                transition-all duration-300
                overflow-hidden flex items-center justify-center gap-2
                border shadow-md hover:shadow-lg
              "
              style={{
                background: `linear-gradient(135deg, ${khakiDark} 0%, ${khakiPrimary} 100%)`,
                color: navyDark,
                borderColor: `${khakiPrimary}30`
              }}
            >
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span className="font-semibold">Add Officer</span>
            </Link>
          )}
        </div>
      </div>

      <div 
        className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg border border-gray-200"
      >
        <MetricsCards />
      </div>

      <div 
        className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg border border-gray-200"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: navyDark }}>
            Alerts & Notifications
          </h2>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-gray-600">Live</span>
          </div>
        </div>
        <AlertsPanel />
      </div>
    </div>
  );
}