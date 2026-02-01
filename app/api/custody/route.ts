import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import CustodyLog from "@/models/CustodyLog";
import Property from "@/models/Property";
import AuditLog from "@/models/AuditLog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session || !["ADMIN", "OFFICER"].includes(session.user.role)) {
      return NextResponse.json(
        { error: "Not authorized to move property" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { propertyId, toLocation, purpose, remarks } = body;

    
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return NextResponse.json({ error: "Invalid propertyId" }, { status: 400 });
    }

   
    const property = await Property.findById(propertyId);
    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    const fromLocation = property.location;

 
    const custodyLog = await CustodyLog.create({
      propertyId,
      fromLocation,
      toLocation,
      purpose,
      handledBy: session.user.id,
      remarks
    });

    
    property.location = toLocation;
    await property.save();

   
    await AuditLog.create({
      actionType: "PROPERTY_MOVED",
      entityType: "PROPERTY",
      entityId: propertyId,
      performedBy: session.user.id,
      oldValue: { location: fromLocation },
      newValue: { location: toLocation }
    });

    return NextResponse.json(
      { message: "Property moved successfully", custodyLog },
      { status: 201 }
    );

  } catch (error) {
    console.error("Custody error:", error);
    return NextResponse.json(
      { error: "Failed to move property" },
      { status: 500 }
    );
  }
}


export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const propertyId = searchParams.get("propertyId");

  if (!propertyId) {
    return NextResponse.json(
      { error: "propertyId is required" },
      { status: 400 }
    );
  }

  const logs = await CustodyLog.find({ propertyId }).sort({ createdAt: 1 });
  return NextResponse.json(logs);
}
