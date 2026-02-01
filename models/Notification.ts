import { Schema, model, models } from "mongoose";

const NotificationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  type: {
    type: String,
    enum: ["PENDING_CASE"],
    required: true,
  },

  referenceId: {
    type: Schema.Types.ObjectId,
    required: true,
  },

  message: {
    type: String,
    required: true,
  },

  read: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});


NotificationSchema.index(
  { userId: 1, type: 1, referenceId: 1 },
  { unique: true },
);

export default models.Notification || model("Notification", NotificationSchema);
