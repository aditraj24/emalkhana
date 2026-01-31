"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [officerId, setOfficerId] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#334155]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl text-center mb-6 text-[#334155]">
          e-Malkhana Login
        </h2>

        <input
          placeholder="Officer ID"
          className="w-full border px-3 py-2 mb-3 rounded"
          onChange={e => setOfficerId(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border px-3 py-2 mb-4 rounded"
          onChange={e => setPassword(e.target.value)}
        />

        <button
          onClick={() =>
            signIn("credentials", {
              officerId,
              password,
              callbackUrl: "/"
            })
          }
          className="w-full bg-[#334155] text-white py-2 rounded hover:bg-[#1e293b]"
        >
          Login
        </button>
      </div>
    </div>
  );
}
