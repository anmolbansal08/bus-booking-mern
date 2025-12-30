const mongoose = require("mongoose");

const busSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      required: true
    },
    departureTime: {
      type: String,
      required: true
    },
    arrivalTime: {
      type: String,
      required: true
    },
    totalSeats: {
      type: Number,
      required: true
    },
seatLayout: [
  {
    seatNumber: { type: String, required: true },
    deck: { type: String, enum: ["LOWER", "UPPER"], required: true },
    type: { type: String, enum: ["SEATER", "SLEEPER"], required: true },
    price: { type: Number, required: true }
  }
],
    amenities: {
      type: [String],
      default: [],
    },
    availableDates:{
      type:[String],
      required:true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bus", busSchema);