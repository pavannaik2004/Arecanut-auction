const User = require("../models/User");
const Auction = require("../models/Auction");
const Transaction = require("../models/Transaction");
const Bid = require("../models/Bid");
const { closeAuction } = require("../services/auctionService");
const { Op } = require("sequelize");

// Get Pending Approvals
exports.getPendingUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        isApproved: false,
        role: { [Op.ne]: "admin" },
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Approve User
exports.approveUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isApproved = true;
    await user.save();

    res.json({ message: "User approved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Reject/Delete User
exports.rejectUser = async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id } });
    res.json({ message: "User rejected and removed" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get All Auctions (with filters)
exports.getAllAuctions = async (req, res) => {
  try {
    const { status } = req.query; // active, closed, completed, or all

    let where = {};
    if (status && status !== "all") {
      where.status = status;
    }

    const auctions = await Auction.findAll({
      where,
      include: [
        {
          model: User,
          as: "farmer",
          attributes: ["name", "email", "farmLocation"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(auctions);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get Single Auction Details (Admin view)
exports.getAuctionById = async (req, res) => {
  try {
    const auction = await Auction.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "farmer",
          attributes: ["name", "email", "farmLocation"],
        },
      ],
    });

    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    // Fetch bids history
    const bids = await Bid.findAll({
      where: { auctionId: req.params.id },
      include: [
        {
          model: User,
          as: "trader",
          attributes: ["name", "email"],
        },
      ],
      order: [["amount", "DESC"]],
    });

    res.json({ auction, bids });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get All Transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      include: [
        {
          model: User,
          as: "farmer",
          attributes: ["name", "email"],
        },
        {
          model: User,
          as: "trader",
          attributes: ["name", "email"],
        },
        {
          model: Auction,
          as: "auction",
          attributes: ["variety", "quantity", "location"],
        },
      ],
      order: [["transactionDate", "DESC"]],
    });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Terminate/Close Auction manually
exports.terminateAuction = async (req, res) => {
  try {
    const auctionId = req.params.id;

    const auction = await Auction.findByPk(auctionId);
    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    if (auction.status !== "active") {
      return res.status(400).json({ message: "Auction is not active" });
    }

    // Close the auction using the service
    await closeAuction(auctionId);

    res.json({ message: "Auction terminated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get Dashboard Statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count({
      where: { role: { [Op.ne]: "admin" } },
    });
    const totalFarmers = await User.count({ where: { role: "farmer" } });
    const totalTraders = await User.count({ where: { role: "trader" } });
    const pendingApprovals = await User.count({
      where: { isApproved: false, role: { [Op.ne]: "admin" } },
    });

    const totalAuctions = await Auction.count();
    const activeAuctions = await Auction.count({ where: { status: "active" } });
    const closedAuctions = await Auction.count({ where: { status: "closed" } });
    const completedAuctions = await Auction.count({
      where: { status: "completed" },
    });

    const totalBids = await Bid.count();
    const totalTransactions = await Transaction.count();

    // Calculate total transaction value
    const transactions = await Transaction.findAll();
    const totalTransactionValue = transactions.reduce(
      (sum, t) => sum + t.finalAmount,
      0,
    );

    res.json({
      users: {
        total: totalUsers,
        farmers: totalFarmers,
        traders: totalTraders,
        pendingApprovals,
      },
      auctions: {
        total: totalAuctions,
        active: activeAuctions,
        closed: closedAuctions,
        completed: completedAuctions,
      },
      bidding: {
        totalBids,
        totalTransactions,
        totalTransactionValue,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
