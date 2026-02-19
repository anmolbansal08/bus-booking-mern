const Bus = require("../models/Bus");
const Booking = require("../models/Booking");
const Route = require("../models/Route");
const {getDayOfWeek} = require("../utils/date.utils");
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
exports.searchBuses = async (req, res) => {
  try {
    const { routeId, source, destination, date } = req.query;

    // 1️⃣ Validate input
    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    let finalRouteId = routeId;

    // 2️⃣ Resolve routeId if only source/destination provided
    if (!finalRouteId) {
      if (!source || !destination) {
        return res.status(400).json({
          message: "Either routeId OR source & destination required"
        });
      }

      const route = await Route.findOne({
        source: { $regex: `^${source}$`, $options: "i" },
        destination: { $regex: `^${destination}$`, $options: "i" }
      });

      if (!route) {
        return res.json({ total: 0, buses: [] });
      }

      finalRouteId = route._id;
    }

    // 3️⃣ Availability filtering
    const dayOfWeek = getDayOfWeek(date);

    const buses = await Bus.find({
      routeId: finalRouteId,
      "availability.from": { $lte: date },
      "availability.to": { $gte: date },
      "availability.daysOfWeek": dayOfWeek
    }).populate("routeId", "source destination");

    // 4️⃣ Attach booked seats
    const results = await Promise.all(
      buses.map(async (bus) => {
        const bookings = await Booking.find({
          busId: bus._id,
          travelDate: date,
          status: { $in: ["PAYMENT_PENDING", "CONFIRMED"] }
        });

        const bookedSeats = bookings.flatMap(b => b.seats);

        return {
          ...bus.toObject(),
          bookedSeats
        };
      })
    );

    return res.json({
      total: results.length,
      buses: results
    });

  } catch (err) {
    console.error("Search Buses Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getRecommendedSeats = async (req, res) => {
  try {
    const { busId } = req.params;
    const { travelDate, gender } = req.query;

    if (!travelDate) {
      return res.status(400).json({
        message: "travelDate is required"
      });
    }

    // 🔥 Use lean() to avoid mongoose internal fields
    const bus = await Bus.findById(busId).lean();
    if (!bus) {
      return res.status(404).json({
        message: "Bus not found"
      });
    }

    // Get confirmed bookings
    const confirmedBookings = await Booking.find({
      busId,
      travelDate,
      status: "CONFIRMED"
    }).lean();

    // Create booked seat set
    const bookedSeats = new Set(
      confirmedBookings.flatMap(b => b.seats)
    );

    // Score seats
const scoredSeats = bus.seatLayout
  .filter(seat => {
    if (bookedSeats.has(seat.seatNumber)) return false;
    if (seat.femaleOnly && gender === "MALE") return false;
    return true;
  })
  .map(seat => {
    let score = 50;

    // Deck preference
    if (seat.deck === "LOWER") score += 10;

    // Seat type
    if (seat.type === "SEATER") score += 5;

    // Female preference
    if (seat.femaleOnly && gender === "FEMALE") {
      score += 25;
    }

    // Price sensitivity
    score += Math.max(0, 1200 - seat.price) / 25;

    // Avoid edge seats
    const seatNum = parseInt(seat.seatNumber.replace(/\D/g, ""));
    if (seatNum % 3 !== 0) score += 5;

    // Random tie-breaker
    score += Math.random() * 5;

    return {
      seatNumber: seat.seatNumber,
      deck: seat.deck,
      type: seat.type,
      price: seat.price,
      femaleOnly: seat.femaleOnly,
      score
    };
  })
  .sort((a, b) => b.score - a.score)
  .slice(0, 3);

    return res.json({
      recommendedSeats: scoredSeats
    });

  } catch (error) {
    console.error("Seat recommendation error:", error);
    return res.status(500).json({
      message: "Something went wrong"
    });
  }
};