const express = require("express");
const router = express.Router();
const {
  createRoute,
  searchRoutes,
  getDestinationsBySource
} = require("../controllers/route.controller");

router.post("/", createRoute);
router.get("/search", searchRoutes);

// routes/route.routes.js
router.get("/destinations", getDestinationsBySource);
module.exports = router;