    const express = require("express");
const router = express.Router();
const { createRoute, listRoutes, getAllBookings} = require("../controllers/admin.controller");
const adminOnly = require("../middleware/adminOnly");
const auth = require("../middleware/auth");

const { getAllBusesAdmin, createBus } = require("../controllers/bus.controller");
// (optional) simple admin guard middleware later
router.post("/routes", auth, adminOnly, createRoute);
router.get("/routes", auth, adminOnly,listRoutes);

router.get("/buses",auth,adminOnly,getAllBusesAdmin)
router.post("/buses", auth, adminOnly, createBus);
router.get("/bookings", auth, adminOnly, getAllBookings);

module.exports = router;