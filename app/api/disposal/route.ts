import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Disposal from "@/models/Disposal";
import Property from "@/models/Property";
import Case from "@/models/Case";
import AuditLog from "@/models/AuditLog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

/**
 * DISPOSE PROPERTY (ADMIN ONLY)
 */
export async function POST(req: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admin can dispose property" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { propertyId, disposalType, courtOrderRef, remarks } = body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return NextResponse.json({ error: "Invalid propertyId" }, { status: 400 });
    }

    // Get property
    const property = await Property.findById(propertyId);
    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    // 1. Create disposal record
    const disposal = await Disposal.create({
      propertyId,
      disposalType,
      courtOrderRef,
      disposedBy: session.user.id,
      remarks
    });

    // 2. Update property status
    property.status = "DISPOSED";
    await property.save();

    // 3. Check if all properties of case are disposed
    const remaining = await Property.countDocuments({
      caseId: property.caseId,
      status: { $ne: "DISPOSED" }
    });

    if (remaining === 0) {
      await Case.findByIdAndUpdate(property.caseId, {
        status: "DISPOSED"
      });
    }

    // 4. Audit log
    await AuditLog.create({
      actionType: "PROPERTY_DISPOSED",
      entityType: "PROPERTY",
      entityId: propertyId,
      performedBy: session.user.id,
      newValue: {
        disposalType,
        courtOrderRef
      }
    });

    return NextResponse.json(
      { message: "Property disposed successfully", disposal },
      { status: 201 }
    );

  } catch (error) {
    console.error("Disposal error:", error);
    return NextResponse.json(
      { error: "Failed to dispose property" },
      { status: 500 }
    );
  }
}
