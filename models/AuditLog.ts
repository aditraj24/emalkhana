import { Schema, model, models } from "mongoose";

const AuditLogSchema = new Schema({
  actionType: String,
  entityType: String,
  entityId: Schema.Types.ObjectId,
  performedBy: { type: Schema.Types.ObjectId, ref: "User" },
  timestamp: { type: Date, default: Date.now },
  oldValue: Schema.Types.Mixed,
  newValue: Schema.Types.Mixed,
  ipAddress: String
});

// Prevent updates/deletes
AuditLogSchema.pre("updateOne", () => {
  throw new Error("Audit logs are immutable");
});

export default models.AuditLog || model("AuditLog", AuditLogSchema);
