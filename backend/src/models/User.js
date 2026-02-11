const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    phone: {
      type: String,
      required: false,
      unique: true,
      sparse: true
    },
    password: {
      type: String,
      select: false   // 🔥 important
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local"
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);