"use client";

import { useEffect, useState } from "react";

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
      .then(setData);
  }, []);

  if (!data) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-lg shadow animate-pulse h-24"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card title="Total Cases" value={data.totalCases} />
      <Card title="Pending Cases" value={data.pendingCases} />
      <Card title="Disposed Cases" value={data.disposedCases} />
    </div>
  );
}

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow border-l-4 border-[#334155]">
      <p className="text-sm text-[#94A3B8]">{title}</p>
      <h2 className="text-3xl font-semibold text-[#334155] mt-2">{value}</h2>
    </div>
  );
}
