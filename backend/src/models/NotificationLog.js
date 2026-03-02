const mongoose = require("mongoose");

const notificationLogSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true
    },
    type: {
      type: String,
      enum: ["EMAIL"],
      required: true
    },
    recipient: String,
    status: {
      type: String,
      enum: ["PENDING", "SENT", "FAILED"],
      default: "PENDING"
    },
    errorMessage: String
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "NotificationLog",
  notificationLogSchema
);