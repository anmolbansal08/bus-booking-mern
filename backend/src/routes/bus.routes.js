const express = require("express");
const router = express.Router();
const {
  createBus,
  getBusesByRoute
} = require("../controllers/bus.controller");

router.post("/", createBus);
router.get("/search", getBusesByRoute);

module.exports = router;