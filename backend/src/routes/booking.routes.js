const express = require("express");
const router = express.Router();
const { createBooking,getMyBookings,cancelBooking, lookupBooking,cancelBookingByUser,cancelBookingByTicket } = require("../controllers/booking.controller");
const auth = require("../middleware/auth");


router.post("/", createBooking);
router.get("/my", auth, getMyBookings);
router.patch("/:bookingId/cancel", cancelBooking);
router.post("/lookup",lookupBooking);
// Logged-in
router.patch(
  "/:bookingId/cancel",
  auth,
  cancelBookingByUser
);

// Guest
router.post(
  "/cancel-by-ticket",
  cancelBookingByTicket
);
module.exports = router;