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


export async function POST(req: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "OFFICER"].includes(session.user.role)) {
      return NextResponse.json(
        { error: "Not authorized to add property" },
        { status: 403 }
      );
    }

    const body = await req.json();

    
    if (!mongoose.Types.ObjectId.isValid(body.caseId)) {
      return NextResponse.json({ error: "Invalid caseId" }, { status: 400 });
    }

    const caseExists = await Case.findById(body.caseId);
    if (!caseExists) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

   
    let photoUrl = "";
    if (body.imageBase64) {
      const upload = await cloudinary.uploader.upload(body.imageBase64, {
        folder: "emalkhana/properties"
      });
      photoUrl = upload.secure_url;
    }

    
    const property = await Property.create({
      caseId: body.caseId,
      category: body.category,
      belongsTo: body.belongsTo,
      nature: body.nature,
      quantity: body.quantity,
      location: body.location,
      description: body.description,
      photoUrl,
      status: "IN_CUSTODY"
    });

    
    const qrData = `${process.env.NEXTAUTH_URL}/property/${property._id}`;
    const qrCode = await QRCode.toDataURL(qrData);
    property.qrCode = qrCode;
    await property.save();

  
    await AuditLog.create({
      actionType: "PROPERTY_ADDED",
      entityType: "PROPERTY",
      entityId: property._id,
      performedBy: session.user.id,
      newValue: property
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


export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const caseId = searchParams.get("caseId");
    const status = searchParams.get("status");

    const query: any = {};

    if (caseId) {
      if (!mongoose.Types.ObjectId.isValid(caseId)) {
        return NextResponse.json(
          { error: "Invalid caseId" },
          { status: 400 }
        );
      }
      query.caseId = caseId;
    }

    if (status) {
      query.status = status;
    }

    const properties = await Property.find(query).sort({ createdAt: -1 });
    return NextResponse.json(properties);

  } catch (error) {
    console.error("Get property error:", error);
    return NextResponse.json(
      { error: "Failed to fetch properties" },
      { status: 500 }
    );
  }
}
