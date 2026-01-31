import { Schema, model, models } from "mongoose";

const DisposalSchema = new Schema({
  propertyId: { type: Schema.Types.ObjectId, ref: "Property", required: true },
  disposalType: {
    type: String,
    enum: ["RETURNED", "DESTROYED", "AUCTIONED", "COURT_CUSTODY"]
  },
  courtOrderRef: String,
  disposedBy: { type: Schema.Types.ObjectId, ref: "User" },
  date: { type: Date, default: Date.now },
  remarks: String
});

export default models.Disposal || model("Disposal", DisposalSchema);
