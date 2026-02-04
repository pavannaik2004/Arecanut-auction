const Auction = require("../models/Auction");

// Create New Auction
exports.createAuction = async (req, res) => {
  try {
    const {
      variety,
      quantity,
      qualityGrade,
      basePrice,
      location,
      endTime,
      image,
    } = req.body;

    const auction = await Auction.create({
      farmerId: req.user.id, // From auth middleware
      variety,
      quantity,
      qualityGrade,
      basePrice,
      currentHighestBid: basePrice, // Start with base price
      location,
      endTime,
      image,
      status: "active",
    });

    res.status(201).json({ message: "Auction created successfully", auction });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get My Auctions (For Farmer Dashboard)
exports.getMyAuctions = async (req, res) => {
  try {
    const auctions = await Auction.findAll({
      where: { farmerId: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    res.json(auctions);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
