import { Schema, model, models } from "mongoose";

const CustodyLogSchema = new Schema({
  propertyId: { type: Schema.Types.ObjectId, ref: "Property", required: true },
  fromLocation: String,
  toLocation: String,
  purpose: String,
  handledBy: { type: Schema.Types.ObjectId, ref: "User" },
  dateTime: { type: Date, default: Date.now },
  remarks: String
});

export default models.CustodyLog || model("CustodyLog", CustodyLogSchema);
