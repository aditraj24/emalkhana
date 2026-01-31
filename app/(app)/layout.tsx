import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
})  {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <main className="p-6">{children}</main>
      <Footer />
    </div>
  );
}
