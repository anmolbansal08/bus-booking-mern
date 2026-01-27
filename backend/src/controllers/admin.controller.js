const Booking = require("../models/Booking");
const Route = require("../models/Route");

exports.createRoute = async (req, res) => {
  try {
    const { source, destination, distance } = req.body;

    if (!source || !destination) {
      return res.status(400).json({ message: "Source and destination required" });
    }

    if (source === destination) {
      return res.status(400).json({ message: "Source and destination cannot be same" });
    }

    const exists = await Route.findOne({ source, destination });
    if (exists) {
      return res.status(409).json({ message: "Route already exists" });
    }

    const route = await Route.create({
      source,
      destination,
      distance
    });

    res.status(201).json(route);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.listRoutes = async (req, res) => {
  const routes = await Route.find().sort({ createdAt: -1 });
  res.json(routes);
};


exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });

    console.log("Total bookings:", bookings.length);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};