"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewCasePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    policeStation: "",
    crimeNumber: "",
    year: "",
    actLaw: "",
    sections: ""
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch("/api/case", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        year: Number(form.year),
        sections: form.sections.split(",")
      })
    });

    if (res.ok) {
      alert("Case created successfully");
      router.push("/cases");
    } else {
      alert("Failed to create case");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Create New Case</h1>

      <form onSubmit={handleSubmit}>
        <input name="policeStation" placeholder="Police Station" onChange={handleChange} />
        <br />

        <input name="crimeNumber" placeholder="Crime Number" onChange={handleChange} />
        <br />

        <input name="year" placeholder="Year" onChange={handleChange} />
        <br />

        <input name="actLaw" placeholder="Act & Law" onChange={handleChange} />
        <br />

        <input name="sections" placeholder="Sections (comma separated)" onChange={handleChange} />
        <br />

        <button type="submit">Create Case</button>
      </form>
    </div>
  );
}
