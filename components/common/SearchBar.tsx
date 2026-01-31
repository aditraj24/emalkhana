"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow flex gap-3 items-center">
      <input
        type="text"
        placeholder="Search by Crime No / Officer / Station"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="
          flex-1 border border-[#94A3B8] rounded px-4 py-2
          focus:outline-none focus:ring-2 focus:ring-[#D5C58A]
        "
      />

      <button
        onClick={handleSearch}
        className="
          bg-[#334155] text-white px-6 py-2 rounded
          hover:bg-[#1e293b] transition
        "
      >
        Search
      </button>
    </div>
  );
}
