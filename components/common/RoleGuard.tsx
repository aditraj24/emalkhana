"use client";

import { useSession } from "next-auth/react";

type Props = {
  role: "ADMIN" | "OFFICER" | "MALKHANA";
  children: React.ReactNode;
};

export default function RoleGuard({ role, children }: Props) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="text-center p-6 text-[#94A3B8]">
        Checking permissions...
      </div>
    );
  }

  if (!session || session.user.role !== role) {
    return (
      <div className="bg-white p-6 rounded shadow text-center text-red-600">
        ❌ You are not authorized to access this section
      </div>
    );
  }

  return <>{children}</>;
}
