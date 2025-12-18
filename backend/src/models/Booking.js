const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    busId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      required: true
    },
    travelDate: {
      type: String, // YYYY-MM-DD
      required: true
    },
    seats: {
      type: [String], // ["A1","A2"]
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["CONFIRMED", "CANCELLED"],
      default: "CONFIRMED"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);