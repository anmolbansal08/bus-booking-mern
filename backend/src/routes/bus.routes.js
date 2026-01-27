const express = require("express");
const router = express.Router();

const {
  createBus,
  getBusesByRoute,
  getBusByIdWithAvailability,
  getAllBusesAdmin
} = require("../controllers/bus.controller");

// create bus
router.post("/", createBus);

// search buses by route + date
router.get("/search", getBusesByRoute);

// routes/buses.js
router.get("/admin", getAllBusesAdmin);

// 🔥 get SINGLE bus with availability (MUST BE LAST)
router.get("/:busId", getBusByIdWithAvailability);

module.exports = router;