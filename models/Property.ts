import { Schema, model, models } from "mongoose";

const PropertySchema = new Schema({
  caseId: { type: Schema.Types.ObjectId, ref: "Case", required: true },
  category: String,
  belongsTo: { type: String, enum: ["ACCUSED", "COMPLAINANT", "UNKNOWN"] },
  nature: String,
  quantity: String,
  location: String,
  description: String,
  photoUrl: String,
  qrCode: String,
  status: { type: String, enum: ["IN_CUSTODY", "DISPOSED"], default: "IN_CUSTODY" },
  createdAt: { type: Date, default: Date.now }
});

export default models.Property || model("Property", PropertySchema);
