const express = require("express");
const router = express.Router();
const { createBooking,getMyBookings } = require("../controllers/booking.controller");
const auth = require("../middleware/auth.middleware");


router.post("/", auth, createBooking);
router.get("/my", auth, getMyBookings);
module.exports = router;