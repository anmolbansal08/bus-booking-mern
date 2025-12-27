const Booking = require("../models/Booking");

exports.mockPaymentSuccess = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ message: "bookingId required" });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status !== "PAYMENT_PENDING") {
      return res.status(400).json({
        message: "Payment already processed"
      });
    }

    booking.status = "CONFIRMED";
    booking.payment.status = "SUCCESS";

    await booking.save();

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};