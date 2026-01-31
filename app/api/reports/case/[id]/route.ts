import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Case from "@/models/Case";
import Property from "@/models/Property";
import CustodyLog from "@/models/CustodyLog";
import Disposal from "@/models/Disposal";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const caseData = await Case.findById(params.id);
  const properties = await Property.find({ caseId: params.id });
  const custody = await CustodyLog.find({ propertyId: { $in: properties.map(p => p._id) } });
  const disposal = await Disposal.find({ propertyId: { $in: properties.map(p => p._id) } });

  return NextResponse.json({
    case: caseData,
    properties,
    custody,
    disposal
  });
}
