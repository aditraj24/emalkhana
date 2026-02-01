import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * ADD OFFICER (ADMIN ONLY)
 */
export async function POST(req: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admin can add officers" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, officerId, password, policeStation, role } = body;

    if (!name || !officerId || !password || !policeStation) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existing = await User.findOne({ officerId });
    if (existing) {
      return NextResponse.json(
        { error: "Officer ID already exists" },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      officerId,
      password: hashed,
      policeStation,
      role: role === "ADMIN" ? "ADMIN" : "OFFICER",
    });

    return NextResponse.json(
      {
        message: "Officer created successfully",
        user: {
          id: user._id,
          name: user.name,
          officerId: user.officerId,
          role: user.role,
        },
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Add officer error:", error);
    return NextResponse.json(
      { error: "Failed to add officer" },
      { status: 500 }
    );
  }
}
