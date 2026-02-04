const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, farmLocation, apmcLicense } =
      req.body;

    // Check if user exists
    let user = await User.findOne({ where: { email } });
    if (user) return res.status(400).json({ message: "User already exists" });

    // Create user
    user = await User.create({
      name,
      email,
      password,
      role,
      phone,
      farmLocation: role === "farmer" ? farmLocation : undefined,
      apmcLicense: role === "trader" ? apmcLicense : undefined,
      // Admin needs manual approval usually, or specific seed
      isApproved: false, // Farmer registers and waits for admin approval
    });

    res
      .status(201)
      .json({
        message: "Registration successful. Please wait for Admin approval.",
      });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Check approval
    if (!user.isApproved && user.role !== "admin") {
      // Allow admin even if not "approved" flag? Usually admin is seeded.
      return res.status(403).json({ message: "Account pending approval" });
    }

    // Generate Token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
