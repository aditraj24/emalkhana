import { connectDB } from "@/lib/db";
import { checkPendingCases } from "@/services/pendingCaseAlert.service";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const count = await checkPendingCases();
  return NextResponse.json({ notificationsCreated: count });
}
