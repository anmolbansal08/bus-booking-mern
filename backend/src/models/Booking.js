const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
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
      type: [String],
      required: true
    },
    passengers: [
      {
        name: String,
        age: Number,
        gender: String,
        seatNumber: String
      }
    ],
    contact: {
      phone: String,
      email: String
    },
    totalAmount: Number,
    status: {
      type: String,
      enum: ["CONFIRMED", "CANCELLED"],
      default: "CONFIRMED"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);