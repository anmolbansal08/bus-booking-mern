const Razorpay = require("razorpay");
const crypto = require("crypto");
const Booking = require("../models/Booking");
const generateTicketNumber = require("../utils/generateTicketNumber");
const {
  PAYMENT_EXPIRY_MINUTES,
  MAX_RETRY_ATTEMPTS
} = require("../config/payment");
const SeatLock = require("../models/SeatLock");
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

exports.createRazorpayOrder = async (req, res) => {
  const { bookingId } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  const order = await razorpay.orders.create({
    amount: booking.totalAmount * 100, // paise
    currency: "INR",
    receipt: bookingId
  });

  booking.payment.orderId = order.id;
  await booking.save();

  res.json(order);
};
exports.verifyRazorpayPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    bookingId
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ message: "Invalid payment signature" });
  }

const booking = await Booking.findById(bookingId);

if (!booking) {
  return res.status(404).json({ message: "Booking not found" });
}

if (booking.status !== "PAYMENT_PENDING") {
  return res
    .status(409)
    .json({ message: "Booking already processed" });
}

booking.status = "CONFIRMED";

booking.payment = {
  paymentId: razorpay_payment_id,
  orderId: razorpay_order_id,
  paidAt: new Date(),
  status: "SUCCESS"
};

// 🎟️ Generate ticket number ONCE
if (!booking.ticketNumber) {
  booking.ticketNumber = generateTicketNumber();
}

await booking.save();

await SeatLock.deleteMany({
  busId: booking.busId,
  travelDate: booking.travelDate,
  seatNumber: { $in: booking.seats }
});
res.json({
  message: "Payment verified and booking confirmed",
  booking
});
};
exports.markPaymentFailed = async (req, res) => {
  const { bookingId, reason } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  if (booking.status === "CONFIRMED") {
    return res.status(400).json({ message: "Booking already confirmed" });
  }

  booking.status = "PAYMENT_FAILED";
  booking.payment.status = "FAILED";
  booking.payment.attempts += 1;
  booking.payment.lastFailureReason = reason || "Payment failed";

  await booking.save();
await SeatLock.deleteMany({
  busId: booking.busId,
  travelDate: booking.travelDate,
  seatNumber: { $in: booking.seats }
});
  res.json({
    message: "Payment marked as failed",
    bookingId: booking._id,
    attempts: booking.payment.attempts
  });
};