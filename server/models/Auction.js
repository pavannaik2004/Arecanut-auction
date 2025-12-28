const mongoose = require("mongoose");

const auctionSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    variety: { type: String, required: true }, // e.g., Rashi, Idi, Chooru
    quantity: { type: Number, required: true }, // in KGs
    qualityGrade: { type: String, required: true },
    basePrice: { type: Number, required: true },
    currentHighestBid: { type: Number, default: 0 },
    location: { type: String, required: true }, // APMC location
    image: { type: String }, // Cloudinary URL
    imagePublicId: { type: String }, // Cloudinary public ID for deletion
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "active", "closed", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Indexes for performance
auctionSchema.index({ status: 1, endTime: 1 });
auctionSchema.index({ farmer: 1, createdAt: -1 });
auctionSchema.index({ location: 1, variety: 1 });
auctionSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("Auction", auctionSchema);
