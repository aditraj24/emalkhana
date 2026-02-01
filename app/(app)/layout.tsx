import AuthProvider from "@/components/providers/SessionProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Suspense } from "react";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AuthProvider>
        <Navbar />
        <main className="p-6 bg-[#f8fafc] min-h-screen">{children}</main>
        <Footer />
      </AuthProvider>
    </Suspense>
  );
}
