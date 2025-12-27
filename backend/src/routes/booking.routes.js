const express = require("express");
const router = express.Router();
const { createBooking,getMyBookings,cancelBooking } = require("../controllers/booking.controller");
const auth = require("../middleware/auth.middleware");


router.post("/", auth, createBooking);
router.get("/my", auth, getMyBookings);
router.patch("/:bookingId/cancel", cancelBooking);module.exports = router;