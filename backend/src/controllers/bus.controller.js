const Bus = require("../models/Bus");
const Booking = require("../models/Booking");

// Add bus (admin)
exports.createBus = async (req, res) => {
  try {
    const bus = await Bus.create(req.body);
    res.status(201).json(bus);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get buses for route + date
exports.getBusesByRoute = async (req, res) => {
  const { routeId, date } = req.query;

  const buses = await Bus.find({ routeId });

  const results = [];

  for (let bus of buses) {
    const bookings = await Booking.find({
      busId: bus._id,
      travelDate: date,
      status: "CONFIRMED"
    });

    const bookedSeats = bookings.flatMap(b => b.seats);

    results.push({
      ...bus.toObject(),
      bookedSeats,
      availableSeats: bus.seatLayout.filter(
        seat => !bookedSeats.includes(seat)
      )
    });
  }

  res.json(results);
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
    status: "CONFIRMED"
  });

  const bookedSeats = bookings.flatMap(b => b.seats);

  res.json({
    ...bus.toObject(),
    bookedSeats,
    availableSeats: bus.seatLayout.filter(
      seat => !bookedSeats.includes(seat)
    )
  });
};