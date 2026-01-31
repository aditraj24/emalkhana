import { connectDB } from "@/lib/db";
import Property from "@/models/Property";
import CustodyLog from "@/models/CustodyLog";

export default async function PropertyScanPage({
  params
}: {
  params: { id: string };
}) {
  await connectDB();

  const property = await Property.findById(params.id);
  const custody = await CustodyLog.find({ propertyId: params.id });

  if (!property) return <div>Invalid QR</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Property Verification</h2>

      <p><b>Category:</b> {property.category}</p>
      <p><b>Nature:</b> {property.nature}</p>
      <p><b>Status:</b> {property.status}</p>
      <p><b>Current Location:</b> {property.location}</p>

      <h3>Chain of Custody</h3>
      {custody.map((c: any) => (
        <div key={c._id}>
          {c.fromLocation} → {c.toLocation} ({c.purpose})
        </div>
      ))}
    </div>
  );
}
