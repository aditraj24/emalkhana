import AuthProvider from "@/components/providers/SessionProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <Navbar />
      <main className="p-6 bg-[#f8fafc] min-h-screen">{children}</main>
      <Footer />
    </AuthProvider>
  );
}
