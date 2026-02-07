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
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    isGuestBooking: {
      type: Boolean,
      default: false
    },
    ticketNumber: {
      type: String,
      unique: true,
      index: true
    },
    totalAmount: Number,
    status: {
      type: String,
      enum: [
        "PAYMENT_PENDING",
        "PAYMENT_FAILED",
        "CONFIRMED",
        "CANCELLED",
        "EXPIRED"
      ],  default: "PAYMENT_PENDING"
    },
    ticketNumber: {
      type: String,
      unique: true,
      index: true
    },
    payment: {
      status: {
        type: String,
        enum: ["PENDING", "SUCCESS", "FAILED"],
        default: "PENDING"
      },
      method: {
        type: String,
        default: "MOCK"
      },
      attempts: {
        type: Number,
        default: 0
      },
      lastFailureReason: {
        type: String
      }
    },
    cancelledAt: {
  type: Date
}
  },
  { timestamps: true }
);
module.exports = mongoose.model("Booking", bookingSchema);