import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-[#334155] text-white px-6 py-3 flex justify-between">
      <h2 className="font-bold">e-Malkhana</h2>
      <div className="space-x-4">
        <Link href="/">Dashboard</Link>
        <Link href="/cases">Cases</Link>
        <Link href="/search">Search</Link>
      </div>
    </nav>
  );
}
