const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// =====================
// Register (Local Auth)
// =====================
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      authProvider: "local",
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================
// Forgot Password
// =====================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // Always respond with success to avoid email enumeration
    if (!user) {
      return res.json({ message: "If that email exists, a reset link has been sent" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour

    await user.save({ validateBeforeSave: false });

    const frontend = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetLink = `${frontend}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    // send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const html = `
      <p>Hello,</p>
      <p>You requested a password reset. Click the link below to reset your password. The link is valid for 1 hour.</p>
      <p><a href="${resetLink}">Reset password</a></p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    await transporter.sendMail({
      from: `"HriKri Bus" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password reset request",
      html
    });

    res.json({ message: "If that email exists, a reset link has been sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send reset email" });
  }
};

// =====================
// Reset Password
// =====================
exports.resetPassword = async (req, res) => {
  try {
    const { token, password, email } = req.body;
    if (!token || !password) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      email,
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    }).select('+password');

    if (!user) {
      return res.status(400).json({ message: "Token is invalid or has expired" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Password has been reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to reset password" });
  }
};

// =====================
// Login (Local Auth)
// =====================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    // User not found
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 🚫 Block Google users from password login
    if (user.authProvider === "google") {
      return res.status(400).json({
        message: "This account uses Google sign-in",
      });
    }

    // Password missing (extra safety)
    if (!user.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

const token = jwt.sign(
  {
    id: user._id,        // ✅ use id, not userId
    email: user.email,
    role: user.role
  },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

res.json({
  token,
  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role
  }
});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};