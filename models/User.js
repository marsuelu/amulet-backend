const mongoose = require("mongoose");
const ROLES = ["admin", "manager", "employee"];

const UserSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: [true, "user_id is required"],
      trim: true,
      unique: true,
      max: 50,
    },
    username: {
      type: String,
      required: [true, "username is required"],
      trim: true,
      max: 50,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      select: false,
    },
    role: {
      type: String,
      enum: ROLES,
      default: ROLES[2],
    },
  },
  { timestamps: true },
);

// export default mongoose.model("User", UserSchema);
module.exports = mongoose.model("User", UserSchema);
