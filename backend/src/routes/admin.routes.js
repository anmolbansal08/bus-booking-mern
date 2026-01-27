    const express = require("express");
const router = express.Router();
const { createRoute, listRoutes, getAllBookings} = require("../controllers/admin.controller");

// (optional) simple admin guard middleware later
router.post("/routes", createRoute);
router.get("/routes", listRoutes);
router.get("/bookings", getAllBookings);

module.exports = router;