const express = require("express");
const { mockPaymentSuccess } = require("../controllers/payment.controller");
const router = express.Router();
mockPaymentSuccess

router.post("/mock-success", mockPaymentSuccess);

module.exports = router;