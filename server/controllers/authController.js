const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, farmLocation, apmcLicense } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    // Create user
    user = new User({
      name,
      email,
      password,
      role,
      phone,
      farmLocation: role === 'farmer' ? farmLocation : undefined,
      apmcLicense: role === 'trader' ? apmcLicense : undefined,
      // Admin needs manual approval usually, or specific seed
      isApproved: role === 'farmer' ? true : false // Auto-approve farmers, Traders need approval? Let's say false for both for safety, or farmers true. WAD Report says "Farmer... waits for approval". Actually 6.1 says "Farmer registers and waits for admin approval".
    });

    // Let's stick to the report: "Farmer registers and waits for admin approval"
    user.isApproved = false; 

    await user.save();

    res.status(201).json({ message: 'Registration successful. Please wait for Admin approval.' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Check approval
    if (!user.isApproved && user.role !== 'admin') { // Allow admin even if not "approved" flag? Usually admin is seeded.
       return res.status(403).json({ message: 'Account pending approval' });
    }

    // Generate Token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
