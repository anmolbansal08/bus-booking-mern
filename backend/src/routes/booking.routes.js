const express = require("express");
const router = express.Router();
const { createBooking,getMyBookings,cancelBooking, lookupBooking } = require("../controllers/booking.controller");
const auth = require("../middleware/auth");


router.post("/", createBooking);
router.get("/my", auth, getMyBookings);
router.patch("/:bookingId/cancel", cancelBooking);
router.post("/lookup",lookupBooking);

module.exports = router;