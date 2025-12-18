const Booking = require("../models/Booking");
const Bus = require("../models/Bus");

// Create booking
exports.createBooking = async (req, res) => {
  try {
    const userId = req.userId;
    const {busId, travelDate, seats } = req.body;
  
    // 1️⃣ Check if bus exists
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    // 2️⃣ Find already booked seats for this bus + date
    const existingBookings = await Booking.find({
      busId,
      travelDate,
      status: "CONFIRMED"
    });

    const bookedSeats = existingBookings.flatMap(b => b.seats);

    // 3️⃣ Check for seat conflict
    const conflictSeats = seats.filter(seat =>
      bookedSeats.includes(seat)
    );

    if (conflictSeats.length > 0) {
      return res.status(409).json({
        message: "Some seats are already booked",
        conflictSeats
      });
    }

    // 4️⃣ Calculate amount
    const amount = seats.length * bus.price;

    // 5️⃣ Create booking
    const booking = await Booking.create({
      userId,
      busId,
      travelDate,
      seats,
      amount
    });

    res.status(201).json({
      message: "Booking confirmed",
      booking
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }

};

exports.getMyBookings = async (req, res) => {
  const bookings = await Booking.find({ userId: req.userId })
    .populate("busId")
    .sort({ createdAt: -1 });

  res.json(bookings);
};