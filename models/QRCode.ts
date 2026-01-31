import { Schema, model, models } from "mongoose";

const QRCodeSchema = new Schema({
  propertyId: { type: Schema.Types.ObjectId, ref: "Property" },
  generatedAt: { type: Date, default: Date.now },
  printedBy: { type: Schema.Types.ObjectId, ref: "User" }
});

export default models.QRCode || model("QRCode", QRCodeSchema);
