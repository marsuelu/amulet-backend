import mongoose from "mongoose";
import { ROLES } from "../config/user";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: "username is required",
      trim: true,
      unique: true,
      max: 50,
    },
    password: {
      type: String,
      required: "password is required",
      trim: true,
      min: 6,
      max: 20,
      select: false,
    },
    email: {
      type: String,
      required: "email is required",
      trim: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ROLES,
      default: ROLES[2],
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", UserSchema);
