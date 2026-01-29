const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
// Login (Local Auth)
// =====================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

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
  { userId: user._id,
    role: user.role   // 👈 ADD THIS
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
    role: user.role
  }
});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};