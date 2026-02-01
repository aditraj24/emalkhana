"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Metrics = {
  totalCases: number;
  pendingCases: number;
  disposedCases: number;
};

export default function MetricsCards() {
  const [data, setData] = useState<Metrics | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/metrics")
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error("Error:", err));
  }, []);

  if (!data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Total Cases" value={data.totalCases} isPrimary />
        <Card title="Pending Cases" value={data.pendingCases} />
        <Card title="Disposed Cases" value={data.disposedCases} />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
        <Link
          href="/cases"
          className="w-full sm:w-auto px-6 py-2.5 rounded-md font-medium text-sm bg-[#806131] text-white hover:bg-[#aa792e] transition-colors shadow-sm text-center"
        >
          View All Cases
        </Link>
        <Link
          href="/property"
          className="w-full sm:w-auto px-6 py-2.5 rounded-md font-medium text-sm bg-slate-800 text-white hover:bg-slate-900 transition-colors shadow-sm text-center"
        >
          View Properties
        </Link>
      </div>
    </div>
  );
}

function Card({ title, value, isPrimary }: { title: string; value: number; isPrimary?: boolean }) {
  return (
    <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
        {title}
      </p>
      <div className="flex items-baseline gap-2 mt-2">
        <h2 className={`text-3xl font-bold ${isPrimary ? 'text-[#806131]' : 'text-slate-800'}`}>
          {value.toLocaleString()}
        </h2>
      </div>
    </div>
  );
}