import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Case from "@/models/Case";
import AuditLog from "@/models/AuditLog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * CREATE CASE
 * Only OFFICER can create case
 */
export async function POST(req: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "OFFICER") {
      return NextResponse.json(
        { error: "Only officers can create cases" },
        { status: 403 }
      );
    }

    const body = await req.json();

    const newCase = await Case.create({
      policeStation: body.policeStation,
      crimeNumber: body.crimeNumber,
      year: body.year,
      actLaw: body.actLaw,
      sections: body.sections,
      investigatingOfficer: session.user.id,
      status: "PENDING"
    });

    await AuditLog.create({
      actionType: "CASE_CREATED",
      entityType: "CASE",
      entityId: newCase._id,
      performedBy: session.user.id,
      newValue: newCase
    });

    return NextResponse.json(newCase, { status: 201 });

  } catch (error: any) {
    console.error("Create case error:", error);

    return NextResponse.json(
      { error: "Failed to create case" },
      { status: 500 }
    );
  }
}

/**
 * GET ALL CASES
 */
export async function GET() {
  await connectDB();

  const cases = await Case.find().sort({ createdAt: -1 });
  return NextResponse.json(cases);
}
