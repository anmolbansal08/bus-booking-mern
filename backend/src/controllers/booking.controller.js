const Booking = require("../models/Booking");
const Bus = require("../models/Bus");

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

if (!bus) {
  return res.status(404).json({ message: "Bus not found" });
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
    method: "MOCK"
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
      return res.status(409).json({ message: "Booking is already cancelled" });
    }

    booking.status = "CANCELLED";
    await booking.save();

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};