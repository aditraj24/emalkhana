"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function Login() {
  const [officerId, setOfficerId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    await signIn("credentials", {
      officerId,
      password,
      callbackUrl: "/dashboard"
    });
  };

  return (
    <div>
      <input placeholder="Officer ID" onChange={e => setOfficerId(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
