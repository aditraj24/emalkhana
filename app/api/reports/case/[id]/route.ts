import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Case from "@/models/Case";
import Property from "@/models/Property";
import CustodyLog from "@/models/CustodyLog";
import Disposal from "@/models/Disposal";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    
    const { id } = await context.params;

    const caseData = await Case.findById(id).populate(
      "investigatingOfficer",
      "name officerId",
    );

    if (!caseData) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    const properties = await Property.find({ caseId: id });
    const custody = await CustodyLog.find({
      propertyId: { $in: properties.map((p) => p._id) },
    });
    const disposal = await Disposal.find({
      propertyId: { $in: properties.map((p) => p._id) },
    });

    return NextResponse.json({
      case: caseData,
      properties,
      custody,
      disposal,
    });
  } catch (err) {
    console.error("Report error:", err);
    return NextResponse.json(
      { error: "Failed to fetch report" },
      { status: 500 },
    );
  }
}
