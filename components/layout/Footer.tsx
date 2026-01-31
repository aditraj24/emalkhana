export default function Footer() {
  return (
    <footer className="bg-[#334155] text-[#FFFFFF] mt-10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center text-sm">
        <p>
          © {new Date().getFullYear()} Digital e-Malkhana System
        </p>

        <p className="text-[#94A3B8] mt-2 md:mt-0">
          Police Evidence Management Platform
        </p>
      </div>
    </footer>
  );
}
