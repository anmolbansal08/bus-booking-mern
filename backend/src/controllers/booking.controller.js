const Booking = require("../models/Booking");
const Bus = require("../models/Bus");
const { PAYMENT_EXPIRY_MINUTES } =require("../config/payment");
const MAX_RETRY_ATTEMPTS = 3;
const {getDayOfWeek} = require("../utils/date.utils");
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

    if (!busId || !travelDate || !seats?.length || !passengers?.length) {
      return res.status(400).json({ message: "Invalid booking data" });
    }

    if (seats.length !== passengers.length) {
      return res.status(400).json({
        message: "Seats and passengers count mismatch"
      });
    }

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

const searchDay = getDayOfWeek(travelDate);

if (
  travelDate < bus.availability.from ||
  travelDate > bus.availability.to ||
  !bus.availability.daysOfWeek.includes(searchDay)
) {
  return res.status(400).json({
    message: "Bus does not operate on selected date"
  });
}

    /* seat validation */
    const seatMap = new Map(
      bus.seatLayout.map(s => [s.seatNumber, s])
    );

    for (const p of passengers) {
      const seat = seatMap.get(p.seatNumber);

      if (!seat) {
        return res.status(400).json({
          message: "Invalid seat selected"
        });
      }

      if (seat.femaleOnly && p.gender !== "Female") {
        return res.status(400).json({
          message: `Seat ${seat.seatNumber} is reserved for female passengers only`
        });
      }
    }

    /* block confirmed seats only (seat locking later) */
    const alreadyBooked = await Booking.find({
      busId,
      travelDate,
      seats: { $in: seats },
      status: "CONFIRMED"
    });

    if (alreadyBooked.length) {
      return res.status(409).json({
        message: "Some seats already booked"
      });
    }

    const booking = await Booking.create({
      busId,
      travelDate,
      seats,
      passengers,
      contact,
      totalAmount,
      userId: req.user?._id || null,
      isGuestBooking: !req.user,
      status: "PAYMENT_PENDING",
      payment: {
        status: "PENDING",
        attempts: 1
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

    if (["CANCELLED", "EXPIRED"].includes(booking.status)) {
      return res.status(409).json({
        message: `Booking already ${booking.status.toLowerCase()}`
      });
    }

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

exports.retryPayment = async (req, res) => {
  const { bookingId } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  if (["CANCELLED", "CONFIRMED", "EXPIRED"].includes(booking.status)) {
    return res.status(400).json({
      message: "Booking cannot be retried"
    });
  }

  if (booking.payment.attempts >= MAX_RETRY_ATTEMPTS) {
    return res.status(400).json({
      message: "Retry limit exceeded"
    });
  }

  /* expiry based on creation time*/
  const expiryTime = new Date(
    booking.createdAt.getTime() +
      PAYMENT_EXPIRY_MINUTES * 60 * 1000
  );

  if (new Date() > expiryTime) {
    booking.status = "EXPIRED";
    await booking.save();
    return res.status(400).json({
      message: "Booking expired"
    });
  }

  booking.payment.attempts += 1;
  booking.payment.status = "PENDING";
  booking.status = "PAYMENT_PENDING";

  await booking.save();

  res.json({
    message: "Retry allowed",
    bookingId: booking._id,
    attemptsLeft: MAX_RETRY_ATTEMPTS - booking.payment.attempts
  });
};

exports.lookupBooking = async (req, res) => {
  const { ticketNumber, phone } = req.body;

  if (!ticketNumber || !phone) {
    return res.status(400).json({
      message: "Ticket number and phone are required"
    });
  }

  const booking = await Booking.findOne({
    ticketNumber,
    "contact.phone": phone
  }).populate({
    path: "busId",
    select: "name departureTime arrivalTime routeId",
    populate: {
      path: "routeId",
      select: "source destination"
    }
  });

  if (!booking) {
    return res.status(404).json({
      message: "Booking not found"
    });
  }

  res.json(booking);
};