import { connectDB } from "@/lib/db";
import Case from "@/models/Case";

export default async function CasesPage() {
  await connectDB();
  const cases = await Case.find().sort({ createdAt: -1 });

  return (
    <div style={{ padding: 20 }}>
      <h1>All Cases</h1>

      {cases.map((c: any) => (
        <div key={c._id} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
          <p>Crime No: {c.crimeNumber}</p>
          <p>Status: {c.status}</p>
        </div>
      ))}
    </div>
  );
}
