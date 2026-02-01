import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Notification from "@/models/Notification";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * GET notifications for logged-in user
 */
export async function GET() {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const notifications = await Notification.find({
    userId: session.user.id,
  })
    .sort({ createdAt: -1 })
    .limit(20);

  return NextResponse.json(notifications);
}
