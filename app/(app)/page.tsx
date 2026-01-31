import MetricsCards from "@/components/dashboard/MetricsCards";
import AlertsPanel from "@/components/dashboard/AlertsPanel";
import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Header with CTA */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-[#334155]">
          Dashboard
        </h1>

        <Link
          href="/cases/new"
          className="
            bg-[#334155] text-white px-5 py-2 rounded
            hover:bg-[#1e293b] transition
          "
        >
          ➕ New Case
        </Link>
        

      </div>

      <MetricsCards />
      <AlertsPanel />
    </div>
  );
}
