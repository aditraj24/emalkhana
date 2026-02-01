import type { Metadata } from "next";
import "@/styles/globals.css";
import "@/styles/print.css";
import { Suspense } from "react";
export const metadata: Metadata = {
  title: "E-Malkhana",
  description: "Official Government Portal",
  icons: {
    icon: "/jhpolice.png", 
    apple: "/jhpolice.png", 
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
      </head>
      <Suspense fallback={<div>Loading...</div>}>
        <body>{children}</body>
      </Suspense>
    </html>
  );
}