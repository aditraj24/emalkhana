import type { Metadata } from "next";
import "@/styles/globals.css";
import "@/styles/print.css";

export const metadata: Metadata = {
  title: "E-Malkhana",
  description: "Official Government Portal",
  icons: {
    icon: "/jhpolice.png", // Moved inside the icons object
    // Optional: add apple-touch-icon for mobile users
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
      <body>{children}</body>
    </html>
  );
}