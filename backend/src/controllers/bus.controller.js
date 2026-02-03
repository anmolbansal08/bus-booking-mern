const Bus = require("../models/Bus");
const Booking = require("../models/Booking");

// Add bus (admin)
exports.createBus = async (req, res) => {
  try {
    if (!req.body.routeId || !req.body.availableDates) {
  return res.status(400).json({ message: "Missing required fields" });
}
const isValidISODate = /^\d{4}-\d{2}-\d{2}$/;

if (
  !Array.isArray(req.body.availableDates) ||
  !req.body.availableDates.every(d => isValidISODate.test(d))
) {
  return res.status(400).json({
    message: "availableDates must be in YYYY-MM-DD format"
  });
}
    const bus = await Bus.create({
      name: req.body.name,
      routeId: req.body.routeId,          // ✅ REQUIRED
      price: req.body.price,   // ✅ REQUIRED
      seatLayout: req.body.seatLayout,
      bookedSeats: [],
      departureTime: req.body.departureTime,
      arrivalTime: req.body.arrivalTime,
      amenities: req.body.amenities || [], // ✅ FIXED
      availableDates:req.body.availableDates,
      busInfo:req.body.busInfo
    });

    res.status(201).json(bus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get buses for route + date
exports.getBusesByRoute = async (req, res) => {
  const { routeId, date } = req.query;

  const buses = await Bus.find({ routeId,availableDates:date })
  .populate("routeId", "source destination");;

  const results = [];
  for (let bus of buses) {
const bookings = await Booking.find({
      busId: bus._id,
      travelDate: date,
  status: { $in: ["PAYMENT_PENDING", "CONFIRMED"] }
});

    const bookedSeats = bookings.flatMap(b => b.seats);

    results.push({
      ...bus.toObject(),
      bookedSeats,
availableSeats: bus.seatLayout.filter(
  seat => !bookedSeats.includes(seat.seatNumber)
)
    });
  }

      res.json({
      total: results.length,   // ✅ REQUIRED
      buses: results
    });
};
exports.getBusByIdWithAvailability = async (req, res) => {
  const { busId } = req.params;
  const { date } = req.query;

  const bus = await Bus.findById(busId);
  if (!bus) {
    return res.status(404).json({ message: "Bus not found" });
  }

const bookings = await Booking.find({
  busId,
  travelDate: date,
  status: { $in: ["PAYMENT_PENDING", "CONFIRMED"] }
});

  const bookedSeats = bookings.flatMap(b => b.seats);

  res.json({
    ...bus.toObject(),
    bookedSeats,
    availableSeats: bus.seatLayout.filter(
seat => !bookedSeats.includes(seat.seatNumber)    )
  });
};
// controllers/bus.controller.js
exports.getAllBusesAdmin = async (req, res) => {
  try {
    const buses = await Bus.find()
      .populate("routeId", "source destination");

    res.json(buses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};