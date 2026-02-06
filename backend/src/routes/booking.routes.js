const express = require("express");
const router = express.Router();
const { createBooking,getMyBookings,cancelBooking, lookupBooking } = require("../controllers/booking.controller");
const auth = require("../middleware/auth");


router.post("/", auth, createBooking);
router.get("/my", auth, getMyBookings);
router.patch("/:bookingId/cancel", cancelBooking);module.exports = router;
router.post("/lookup",lookupBooking);