import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Property from "@/models/Property";
import Case from "@/models/Case";
import AuditLog from "@/models/AuditLog";
import QRCode from "qrcode";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";
import cloudinary from "@/lib/cloudinary";

/**
 * ADD PROPERTY (OFFICER ONLY)
 */
export async function POST(req: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "OFFICER") {
      return NextResponse.json(
        { error: "Only officers can add property" },
        { status: 403 }
      );
    }

    const body = await req.json();

    // 1. Validate caseId
    if (!mongoose.Types.ObjectId.isValid(body.caseId)) {
      return NextResponse.json({ error: "Invalid caseId" }, { status: 400 });
    }

    const caseExists = await Case.findById(body.caseId);
    if (!caseExists) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    // 2. Upload image to Cloudinary (if present)
    let photoUrl = "";
    if (body.imageBase64) {
      const upload = await cloudinary.uploader.upload(body.imageBase64, {
        folder: "emalkhana/properties",
      });
      photoUrl = upload.secure_url;
    }

    // 3. Create property
    const property = await Property.create({
      caseId: body.caseId,
      category: body.category,
      belongsTo: body.belongsTo,
      nature: body.nature,
      quantity: body.quantity,
      location: body.location,
      description: body.description,
      photoUrl,
      status: "IN_CUSTODY",
    });

    // 4. Generate QR code
    const qrData = `${process.env.NEXTAUTH_URL}/property/${property._id}`;
    const qrCode = await QRCode.toDataURL(qrData);

    property.qrCode = qrCode;
    await property.save();

    // 5. Audit log
    await AuditLog.create({
      actionType: "PROPERTY_ADDED",
      entityType: "PROPERTY",
      entityId: property._id,
      performedBy: session.user.id,
      newValue: property,
    });

    return NextResponse.json(property, { status: 201 });

  } catch (error) {
    console.error("Property error:", error);
    return NextResponse.json(
      { error: "Failed to add property" },
      { status: 500 }
    );
  }
}

/**
 * GET PROPERTIES OF A CASE
 */
export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const caseId = searchParams.get("caseId");

  if (!caseId) {
    return NextResponse.json({ error: "caseId is required" }, { status: 400 });
  }

  const properties = await Property.find({ caseId });
  return NextResponse.json(properties);
}
