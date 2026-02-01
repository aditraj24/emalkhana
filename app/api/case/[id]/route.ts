import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Case from "@/models/Case";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    // ✅ unwrap params (MANDATORY in Next 15)
    const { id } = await context.params;

    const caseData = await Case.findById(id).populate(
      "investigatingOfficer",
      "name officerId",
    );

    if (!caseData) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    return NextResponse.json(caseData);
  } catch (error) {
    console.error("Get case error:", error);
    return NextResponse.json(
      { error: "Failed to fetch case" },
      { status: 500 },
    );
  }
}
