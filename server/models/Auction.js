const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  variety: { type: String, required: true }, // e.g., Rashi, Idi, Chooru
  quantity: { type: Number, required: true }, // in KGs
  qualityGrade: { type: String, required: true },
  basePrice: { type: Number, required: true },
  currentHighestBid: { type: Number, default: 0 },
  location: { type: String, required: true }, // APMC location
  image: { type: String }, // URL or path
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['active', 'closed', 'completed'], 
    default: 'active' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Auction', auctionSchema);
