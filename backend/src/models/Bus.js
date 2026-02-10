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
    seatLayout: [
  {
    seatNumber: { type: String, required: true },
    deck: { type: String, enum: ["LOWER", "UPPER"], required: true },
    type: { type: String, enum: ["SEATER", "SLEEPER"], required: true },
    price: { type: Number, required: true },
    femaleOnly: { type: Boolean, default: false } // 👈
  }
    ],
    amenities: {
      type: [String],
      default: []
    },
    availability: {
      from: {
        type: String, // YYYY-MM-DD
        required: true
      },
      to: {
        type: String, // YYYY-MM-DD
        required: true
      },
      daysOfWeek: {
        type: [String],
        enum: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
        required: true
      }
    },
    busInfo: {
      highlights: [String],
      routeStops: [String],
      boardingPoints: [
        {
          name: String,
          time: String,
          address: String
        }
      ],
      droppingPoints: [
        {
          name: String,
          time: String,
          address: String
        }
      ],
            restStop: {
        name: String,
        time: String,
        durationMins: Number
      },
      policies: {
        cancellation: String,
        luggage: String,
        pets: String
      },        
      type: Object,
        default: {}
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bus", busSchema);