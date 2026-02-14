// models/SeatLock.js

const mongoose = require("mongoose");

const seatLockSchema = new mongoose.Schema({
  busId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bus",
    required: true
  },
  travelDate: {
    type: String,
    required: true
  },
  seatNumber: {
    type: String,
    required: true
  },
  lockedUntil: {
    type: Date,
    required: true
  }
});

// 🔥 CRITICAL PART
seatLockSchema.index(
  { busId: 1, travelDate: 1, seatNumber: 1 },
  { unique: true }
);

module.exports = mongoose.model("SeatLock", seatLockSchema);