import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Property from "@/models/Property";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    // ✅ UNWRAP PARAMS (THIS FIXES YOUR ERROR)
    const { id } = await context.params;

    const property = await Property.findById(id)
      .populate("caseId", "crimeNumber policeStation");

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(property);

  } catch (err) {
    console.error("Get property error:", err);
    return NextResponse.json(
      { error: "Failed to fetch property" },
      { status: 500 }
    );
  }
}
