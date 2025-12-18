const express = require("express");
const router = express.Router();
const {
  createRoute,
  searchRoutes
} = require("../controllers/route.controller");

router.post("/", createRoute);
router.get("/search", searchRoutes);

module.exports = router;