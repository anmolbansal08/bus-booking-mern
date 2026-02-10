const Bus = require("../models/Bus");
const Booking = require("../models/Booking");

// Add bus (admin)
exports.createBus = async (req, res) => {
  try {
    const { availability } = req.body;

    if (!req.body.routeId) {
      return res.status(400).json({ message: "Missing routeId" });
    }

    if (
      !availability ||
      !availability.from ||
      !availability.to ||
      !availability.daysOfWeek?.length
    ) {
      return res.status(400).json({
        message: "Availability (from, to, daysOfWeek) is required"
      });
    }
    const bus = await Bus.create({
      name: req.body.name,
      routeId: req.body.routeId,
      price: req.body.price,   // ✅ REQUIRED
      seatLayout: req.body.seatLayout,
      bookedSeats: [],
      seatLayout: req.body.seatLayout,
      departureTime: req.body.departureTime,
      arrivalTime: req.body.arrivalTime,
      amenities: req.body.amenities || [],
      availability,               // ✅ SAVE IT
      busInfo: req.body.busInfo
    });

    res.status(201).json(bus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get buses for route + date
exports.getBusesByRoute = async (req, res) => {
  const { routeId, date } = req.query;

  const day = getDayOfWeek(date);

  const buses = await Bus.find({
    routeId,
    "availability.from": { $lte: date },
    "availability.to": { $gte: date },
    "availability.daysOfWeek": day
  }).populate("routeId", "source destination");

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
      bookedSeats
    });
  }

  res.json({
    total: results.length,
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
const getDayOfWeek = dateStr => {
  return ["SUN","MON","TUE","WED","THU","FRI","SAT"][
    new Date(dateStr).getDay()
  ];
};