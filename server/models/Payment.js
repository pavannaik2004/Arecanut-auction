const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  auction: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Auction', 
    required: true 
  },
  trader: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  farmer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['upi', 'bank_transfer', 'card', 'cash'],
    required: true
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  paymentDate: {
    type: Date
  },
  notes: {
    type: String
  }
}, { timestamps: true });

// Indexes for performance
paymentSchema.index({ auction: 1 });
paymentSchema.index({ trader: 1, createdAt: -1 });
paymentSchema.index({ farmer: 1, createdAt: -1 });
paymentSchema.index({ status: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
