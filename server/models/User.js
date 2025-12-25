const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['farmer', 'trader', 'admin'], required: true },
  phone: { type: String },
  // Specific fields
  farmLocation: { type: String }, // For Farmer
  apmcLicense: { type: String },  // For Trader
  isApproved: { type: Boolean, default: false } // Admin approval
}, { timestamps: true });

// Password hashing middleware
// Password hashing middleware
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Method to check password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
