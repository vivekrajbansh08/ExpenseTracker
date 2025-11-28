import mongoose, { Document } from "mongoose";

export interface ITempUser extends Document {
  name: string;
  email: string;
  password: string;
  otp: number;
  otpExpires: Date;
}

const tempUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  otp: { type: Number, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600,
  },
});

export default mongoose.model("TempUser", tempUserSchema);
