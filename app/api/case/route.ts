
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Case from "@/models/Case";
import AuditLog from "@/models/AuditLog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


export async function POST(req: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session || !["ADMIN", "OFFICER"].includes(session.user.role)) {
      return NextResponse.json(
        { error: "Not authorized to create cases" },
        { status: 403 },
      );
    }

    const body = await req.json();

   
    const newCase = await Case.create({
      policeStation: body.policeStation,
      crimeNumber: body.crimeNumber,
      year: body.year,
      firDate: body.firDate,
      seizureDate: body.seizureDate,
      actLaw: body.actLaw,
      sections: body.sections,

      investigatingOfficer: session.user.id,
      investigatingOfficerId: session.user.officerId,
      status: "PENDING",
    });

    await AuditLog.create({
      actionType: "CASE_CREATED",
      entityType: "CASE",
      entityId: newCase._id,
      performedBy: session.user.id,
      newValue: newCase,
    });

    return NextResponse.json(newCase, { status: 201 });
  } catch (error) {
    console.error("Create case error:", error);
    return NextResponse.json(
      { error: "Failed to create case" },
      { status: 500 },
    );
  }
}


export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    const query: any = {};

    if (search) {
      query.$or = [
        { crimeNumber: { $regex: search, $options: "i" } },
        { policeStation: { $regex: search, $options: "i" } },
      ];
    }

    const cases = await Case.find(query)
      .populate("investigatingOfficer", "name officerId")
      .sort({ createdAt: -1 });

    return NextResponse.json(cases);
  } catch (error) {
    console.error("Get cases error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cases" },
      { status: 500 },
    );
  }
}
