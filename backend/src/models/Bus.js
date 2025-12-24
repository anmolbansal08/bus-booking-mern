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
    seatLayout: {
      type: [String], // ["A1","A2","B1"...]
      required: true
    },
    price: {
      type: Number,
      required: true
    },
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