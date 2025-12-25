const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  auction: { type: mongoose.Schema.Types.ObjectId, ref: 'Auction', required: true },
  trader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  time: { type: Date, default: Date.now }
}, { timestamps: true });

// Indexes for performance
bidSchema.index({ auction: 1, amount: -1 });
bidSchema.index({ trader: 1, time: -1 });

module.exports = mongoose.model('Bid', bidSchema);
