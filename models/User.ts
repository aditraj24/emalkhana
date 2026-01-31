import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true },
  officerId: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["ADMIN", "OFFICER", "MALKHANA"],
    default: "OFFICER"
  },
  policeStation: String,
  createdAt: { type: Date, default: Date.now }
});

export default models.User || model("User", UserSchema);
