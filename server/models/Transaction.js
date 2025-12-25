const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  auction: { type: mongoose.Schema.Types.ObjectId, ref: 'Auction', required: true },
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  finalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  transactionDate: { type: Date, default: Date.now }
}, { timestamps: true });

// Indexes for performance
transactionSchema.index({ auction: 1 });
transactionSchema.index({ farmer: 1, transactionDate: -1 });
transactionSchema.index({ trader: 1, transactionDate: -1 });
transactionSchema.index({ paymentStatus: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
