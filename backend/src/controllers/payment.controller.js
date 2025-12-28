const Razorpay = require("razorpay");
const crypto = require("crypto");
const Booking = require("../models/Booking");

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
  booking.status = "CONFIRMED";
  booking.payment.status = "SUCCESS";
  booking.payment.paymentId = razorpay_payment_id;

  await booking.save();

  res.json({ success: true });
};