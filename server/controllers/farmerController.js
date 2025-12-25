const Auction = require('../models/Auction');

// Create New Auction
exports.createAuction = async (req, res) => {
  try {
    const { variety, quantity, qualityGrade, basePrice, location, endTime, image } = req.body;

    const auction = new Auction({
      farmer: req.user.id, // From auth middleware
      variety,
      quantity,
      qualityGrade,
      basePrice,
      currentHighestBid: basePrice, // Start with base price
      location,
      endTime,
      image,
      status: 'active'
    });

    await auction.save();
    res.status(201).json({ message: 'Auction created successfully', auction });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get My Auctions (For Farmer Dashboard)
exports.getMyAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find({ farmer: req.user.id }).sort({ createdAt: -1 });
    res.json(auctions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
