const Auction = require('../models/Auction');
const Bid = require('../models/Bid');

// Browse Auctions (with filters)
exports.browseAuctions = async (req, res) => {
  try {
    const { location, variety, minPrice, maxPrice } = req.query;
    let query = { status: 'active' };

    if (location) query.location = new RegExp(location, 'i');
    if (variety) query.variety = new RegExp(variety, 'i');
    if (minPrice || maxPrice) {
      query.basePrice = {};
      if (minPrice) query.basePrice.$gte = Number(minPrice);
      if (maxPrice) query.basePrice.$lte = Number(maxPrice);
    }

    const auctions = await Auction.find(query).populate('farmer', 'name farmLocation').sort({ createdAt: -1 });
    res.json(auctions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get Auction Details
exports.getAuctionById = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id).populate('farmer', 'name');
    if (!auction) return res.status(404).json({ message: 'Auction not found' });
    
    // Also fetch bids history
    const bids = await Bid.find({ auction: req.params.id }).populate('trader', 'name').sort({ amount: -1 });
    
    res.json({ auction, bids });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Place Bid
exports.placeBid = async (req, res) => {
  try {
    const { auctionId, amount } = req.body;

    const auction = await Auction.findById(auctionId);
    if (!auction) return res.status(404).json({ message: 'Auction not found' });

    if (auction.status !== 'active') {
      return res.status(400).json({ message: 'Auction is not active' });
    }

    if (new Date() > new Date(auction.endTime)) {
      return res.status(400).json({ message: 'Auction has ended' });
    }

    if (amount <= auction.currentHighestBid || amount <= auction.basePrice) {
      return res.status(400).json({ message: 'Bid must be higher than current highest bid and base price' });
    }

    // Check if bid is in increments of 10
    if (amount % 10 !== 0) {
      return res.status(400).json({ message: 'Bid amount must be in increments of 10' });
    }

    // Create Bid
    const bid = new Bid({
      auction: auctionId,
      trader: req.user.id,
      amount
    });
    await bid.save();

    // Update Auction
    auction.currentHighestBid = amount;
    await auction.save();

    res.status(201).json({ message: 'Bid placed successfully', bid });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get My Bids
exports.getMyBids = async (req, res) => {
  try {
    const bids = await Bid.find({ trader: req.user.id }).populate('auction').sort({ time: -1 });
    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
