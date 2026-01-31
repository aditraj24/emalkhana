import type { Metadata } from "next";
import "@/styles/globals.css";
import "@/styles/print.css";

export const metadata: Metadata = {
  title: "E-Malkhana",
  description: "Official Government Portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}