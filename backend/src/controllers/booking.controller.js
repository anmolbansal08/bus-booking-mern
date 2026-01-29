const Booking = require("../models/Booking");
const Bus = require("../models/Bus");
const { PAYMENT_EXPIRY_MINUTES } =require("../config/payment")
// Create booking
exports.createBooking = async (req, res) => {
  try {
    const {
      busId,
      travelDate,
      seats,
      passengers,
      contact,
      totalAmount
    } = req.body;

    // Basic validation
    if (!busId || !travelDate || !seats?.length || !passengers?.length) {
      return res.status(400).json({ message: "Invalid booking data" });
    }
const bus = await Bus.findById(busId);

const seatMap = new Map(
  bus.seatLayout.map(s => [s.seatNumber, s])
);

// validate female-only seats
for (const p of passengers) {
  const seat = seatMap.get(p.seatNumber);

  if (!seat) {
    return res.status(400).json({ message: "Invalid seat selected" });
  }

  if (seat.femaleOnly && p.gender !== "Female") {
    return res.status(400).json({
      message: `Seat ${seat.seatNumber} is reserved for female passengers only`
    });
  }
}
if (!bus.availableDates.includes(travelDate)) {
  return res.status(400).json({
    message: "Bus does not operate on selected date"
  });
}
    if (seats.length !== passengers.length) {
      return res
        .status(400)
        .json({ message: "Seats and passengers count mismatch" });
    }

    // Seat availability check
    const alreadyBooked = await Booking.find({
      busId,
      travelDate,
      seats: { $in: seats },
      status: "CONFIRMED"
    });

    if (alreadyBooked.length) {
      return res
        .status(409)
        .json({ message: "Some seats already booked" });
    }

const booking = await Booking.create({
  busId,
  travelDate,
  seats,
  passengers,
  contact,
  totalAmount,
status: "PAYMENT_PENDING",
payment: {
  status: "PENDING",
  attempts: 1,
  lastAttemptAt: new Date()
}
});

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getMyBookings = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const bookings = await Booking.find({
      "contact.email": email
    })
      .populate("busId")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status === "CANCELLED") {
      return res.status(409).json({ message: "Booking already cancelled" });
    }

    if (booking.status === "EXPIRED") {
      return res
        .status(409)
        .json({ message: "Expired booking cannot be cancelled" });
    }

    // PAYMENT_PENDING or CONFIRMED
    booking.status = "CANCELLED";
    booking.cancelledAt = new Date();

    await booking.save();

    res.json({
      message: "Booking cancelled successfully",
      booking
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const MAX_RETRY_ATTEMPTS = 3;

exports.retryPayment = async (req, res) => {
  const { bookingId } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  // ❌ expired / cancelled safety
  if (booking.status === "CANCELLED") {
    return res.status(400).json({ message: "Booking cancelled" });
  }

  // ❌ retry limit
  if (booking.payment.attempts >= MAX_RETRY_ATTEMPTS) {
    return res.status(400).json({
      message: "Retry limit exceeded"
    });
  }

  // ❌ expiry check (reuse your existing logic)
  const expiryTime = new Date(
    Date.now() - PAYMENT_EXPIRY_MINUTES * 60 * 1000
  );

  if (booking.createdAt < expiryTime) {
    booking.status = "CANCELLED";
    await booking.save();
    return res.status(400).json({ message: "Booking expired" });
  }

  // ✅ allow retry
  booking.status = "PAYMENT_PENDING";
  booking.payment.status = "PENDING";

  await booking.save();

  res.json({
    message: "Retry allowed",
    bookingId: booking._id,
    attemptsLeft: MAX_RETRY_ATTEMPTS - booking.payment.attempts
  });
};