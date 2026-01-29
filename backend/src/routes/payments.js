const express = require("express");
const { mockPaymentSuccess,createRazorpayOrder,verifyRazorpayPayment,markPaymentFailed,retryPayment } = require("../controllers/payment.controller");
const router = express.Router();

// router.post("/mock-success", mockPaymentSuccess);
router.post("/razorpay/order", createRazorpayOrder);
router.post("/razorpay/verify", verifyRazorpayPayment);

router.post("/fail", markPaymentFailed);
router.post("/retry", retryPayment);

module.exports = router;