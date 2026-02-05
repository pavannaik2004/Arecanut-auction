const User = require('../models/User');
const Auction = require('../models/Auction');
const Transaction = require('../models/Transaction');
const Bid = require('../models/Bid');
const { closeAuction } = require('../services/auctionService');
const { cleanupOldImages: cleanupOldImagesUtil } = require('../utils/cleanupOldImages');
const { Op } = require('sequelize');

// Get Pending Approvals (Users)
exports.getPendingUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        isApproved: false,
        role: { [Op.ne]: 'admin' },
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Approve User
exports.approveUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isApproved = true;
    await user.save();
    res.json({ message: 'User approved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Reject User
exports.rejectUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.destroy();
    res.json({ message: 'User rejected and removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get All Farmers
exports.getAllFarmers = async (req, res) => {
  try {
    const farmers = await User.findAll({ where: { role: 'farmer' } });
    res.json(farmers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get All Traders
exports.getAllTraders = async (req, res) => {
  try {
    const traders = await User.findAll({ where: { role: 'trader' } });
    res.json(traders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get All Auctions
exports.getAllAuctions = async (req, res) => {
  try {
    const auctions = await Auction.findAll({
      include: [{ model: User, as: 'farmer', attributes: ['name', 'email'] }],
    });
    res.json(auctions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get Pending Auctions
exports.getPendingAuctions = async (req, res) => {
  try {
    const auctions = await Auction.findAll({
      where: { status: 'pending' },
      include: [{ model: User, as: 'farmer', attributes: ['name', 'email'] }],
    });
    res.json(auctions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get Auction By ID
exports.getAuctionById = async (req, res) => {
  try {
    const auction = await Auction.findByPk(req.params.id, {
      include: [{ model: User, as: 'farmer', attributes: ['name', 'email'] }],
    });
    if (!auction) return res.status(404).json({ message: 'Auction not found' });
    res.json(auction);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Edit Auction (Admin override)
exports.editAuction = async (req, res) => {
  try {
    const auction = await Auction.findByPk(req.params.id);
    if (!auction) return res.status(404).json({ message: 'Auction not found' });

    await auction.update(req.body);
    res.json({ message: 'Auction updated successfully', auction });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Approve Auction
exports.approveAuction = async (req, res) => {
  try {
    const auction = await Auction.findByPk(req.params.id);
    if (!auction) return res.status(404).json({ message: 'Auction not found' });

    auction.status = 'active'; // Or whatever logic marks it as live
    // If you have startDate, check it? Assuming active for now.
    auction.startDate = new Date(); // Start now
    auction.endDate = new Date(Date.now() + 24 * 60 * 60 * 1000 * 3); // Default 3 days if not set?
    // Actually, usually headers sent these.
    // If fields are already there, just change status.
    // Let's assume just status changes for approval.
    if (!auction.isApproved) {
        auction.isApproved = true;
    }
    // If the schema uses status enum: pending, active, closed
    auction.status = 'active';
    
    await auction.save();
    res.json({ message: 'Auction approved' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Reject Auction
exports.rejectAuction = async (req, res) => {
  try {
    const auction = await Auction.findByPk(req.params.id);
    if (!auction) return res.status(404).json({ message: 'Auction not found' });

    // Maybe just set status to rejected or delete
    // If you want to keep record:
    auction.status = 'cancelled'; // or 'rejected'
    await auction.save();
    // OR await auction.destroy();
    
    res.json({ message: 'Auction rejected' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Terminate/Close Auction
exports.terminateAuction = async (req, res) => {
  try {
    const result = await closeAuction(req.params.id); // Use service
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get All Transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
        include: [
            { model: User, as: 'buyer', attributes: ['name', 'email'] },
            { model: User, as: 'seller', attributes: ['name', 'email'] },
            { model: Auction, as: 'auction', attributes: ['itemName'] }
        ]
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get Dashboard Stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalFarmers = await User.count({ where: { role: 'farmer' } });
    const totalTraders = await User.count({ where: { role: 'trader' } });
    const pendingApprovals = await User.count({
      where: { isApproved: false, role: { [Op.ne]: 'admin' } }, 
    });

    const totalAuctions = await Auction.count();
    const activeAuctions = await Auction.count({ where: { status: 'active' } });
    const closedAuctions = await Auction.count({ where: { status: 'closed' } });
    const completedAuctions = await Auction.count({
      where: { status: 'completed' },
    });
    const pendingAuctions = await Auction.count({ where: { status: 'pending' } });

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
        pending: pendingAuctions,
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
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Cleanup Old Images
exports.cleanupOldImages = async (req, res) => {
  try {
    const { days } = req.body;
    const result = await cleanupOldImagesUtil(days);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error cleaning up images', error: error.message });
  }
};
