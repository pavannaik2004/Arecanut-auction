const Auction = require("../models/Auction");
const Bid = require("../models/Bid");
const User = require("../models/User");
const { Op } = require("sequelize");

// Browse Auctions (with filters)
exports.browseAuctions = async (req, res) => {
  try {
    const { location, variety, minPrice, maxPrice } = req.query;
    let where = { status: "active" };

    if (location) where.location = { [Op.like]: `%${location}%` };
    if (variety) where.variety = { [Op.like]: `%${variety}%` };
    if (minPrice || maxPrice) {
      where.basePrice = {};
      if (minPrice) where.basePrice[Op.gte] = Number(minPrice);
      if (maxPrice) where.basePrice[Op.lte] = Number(maxPrice);
    }

    const auctions = await Auction.findAll({
      where,
      include: [
        {
          model: User,
          as: "farmer",
          attributes: ["name", "farmLocation"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(auctions);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get Auction Details
exports.getAuctionById = async (req, res) => {
  try {
    const auction = await Auction.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "farmer",
          attributes: ["name"],
        },
      ],
    });

    if (!auction) return res.status(404).json({ message: "Auction not found" });

    // Also fetch bids history
    const bids = await Bid.findAll({
      where: { auctionId: req.params.id },
      include: [
        {
          model: User,
          as: "trader",
          attributes: ["name"],
        },
      ],
      order: [["amount", "DESC"]],
    });

    res.json({ auction, bids });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Place Bid
exports.placeBid = async (req, res) => {
  try {
    const { auctionId, amount } = req.body;

    const auction = await Auction.findByPk(auctionId);
    if (!auction) return res.status(404).json({ message: "Auction not found" });

    if (auction.status !== "active") {
      return res.status(400).json({ message: "Auction is not active" });
    }

    if (new Date() > new Date(auction.endTime)) {
      return res.status(400).json({ message: "Auction has ended" });
    }

    if (amount <= auction.currentHighestBid || amount <= auction.basePrice) {
      return res.status(400).json({
        message: "Bid must be higher than current highest bid and base price",
      });
    }

    // Create Bid
    const bid = await Bid.create({
      auctionId,
      traderId: req.user.id,
      amount,
    });

    // Update Auction
    auction.currentHighestBid = amount;
    await auction.save();

    res.status(201).json({ message: "Bid placed successfully", bid });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get My Bids
exports.getMyBids = async (req, res) => {
  try {
    const bids = await Bid.findAll({
      where: { traderId: req.user.id },
      include: [
        {
          model: Auction,
          as: "auction",
        },
      ],
      order: [["time", "DESC"]],
    });

    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
