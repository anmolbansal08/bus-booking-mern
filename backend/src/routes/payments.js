const express = require("express");
const {createRazorpayOrder,verifyRazorpayPayment,markPaymentFailed } = require("../controllers/payment.controller");
const {retryPayment} = require("../controllers/booking.controller");
const router = express.Router();

router.post("/razorpay/order", createRazorpayOrder);
router.post("/razorpay/verify", verifyRazorpayPayment);

router.post("/fail", markPaymentFailed);
router.post("/retry", retryPayment);

module.exports = router;