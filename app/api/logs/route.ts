import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import AuditLog from "@/models/AuditLog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


export async function GET(req: Request) {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);

  const entityId = searchParams.get("entityId");
  const entityType = searchParams.get("entityType");

  const query: any = {};
  if (entityId) query.entityId = entityId;
  if (entityType) query.entityType = entityType;

  const logs = await AuditLog.find(query)
    .sort({ timestamp: -1 })
    .limit(200);

  return NextResponse.json(logs);
}
