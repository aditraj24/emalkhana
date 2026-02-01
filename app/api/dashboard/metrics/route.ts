import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Case from "@/models/Case";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const totalCases = await Case.countDocuments();

    const disposedCases = await Case.countDocuments({
      status: "DISPOSED"
    });

    const pendingCases = await Case.countDocuments({
      status: "PENDING"
    });

    return NextResponse.json({
      totalCases,
      disposedCases,
      pendingCases
    });

  } catch (error) {
    console.error("Dashboard metrics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard metrics" },
      { status: 500 }
    );
  }
}
