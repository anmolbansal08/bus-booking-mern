const express = require("express");
const router = express.Router();
const { register, login, forgotPassword, resetPassword } = require("../controllers/auth.controller");
const { googleLogin } = require("../controllers/googleAuth.controller");

router.post("/register", register);
router.post("/login", login);
router.post("/forgot", forgotPassword);
router.post("/reset", resetPassword);
// routes/auth.routes.js
router.post("/google", googleLogin);

module.exports = router;