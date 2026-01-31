import { Schema, model, models } from "mongoose";

const CaseSchema = new Schema({
  policeStation: String,
  crimeNumber: String,
  year: Number,
  firDate: Date,
  seizureDate: Date,
  actLaw: String,
  sections: [String],
  investigatingOfficer: { type: Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["PENDING", "DISPOSED"], default: "PENDING" },
  createdAt: { type: Date, default: Date.now }
});

export default models.Case || model("Case", CaseSchema);
