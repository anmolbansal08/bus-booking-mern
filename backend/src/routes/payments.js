const express = require("express");
const { mockPaymentSuccess,createRazorpayOrder,verifyRazorpayPayment } = require("../controllers/payment.controller");
const router = express.Router();

// router.post("/mock-success", mockPaymentSuccess);
router.post("/razorpay/order", createRazorpayOrder);
router.post("/razorpay/verify", verifyRazorpayPayment);

module.exports = router;