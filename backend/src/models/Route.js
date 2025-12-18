const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      required: true
    },
    destination: {
      type: String,
      required: true
    },
    distanceKm: Number,
    duration: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Route", routeSchema);