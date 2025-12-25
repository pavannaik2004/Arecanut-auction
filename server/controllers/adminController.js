const User = require('../models/User');
const Auction = require('../models/Auction');
const Transaction = require('../models/Transaction');
const Bid = require('../models/Bid');
const { closeAuction } = require('../services/auctionService');

// Get Pending Approvals
exports.getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ isApproved: false, role: { $ne: 'admin' } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Approve User
exports.approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isApproved = true;
    await user.save();

    res.json({ message: 'User approved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Reject/Delete User
exports.rejectUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User rejected and removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get All Auctions (with filters)
exports.getAllAuctions = async (req, res) => {
  try {
    const { status } = req.query; // active, closed, completed, or all
    
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const auctions = await Auction.find(query)
      .populate('farmer', 'name email farmLocation')
      .sort({ createdAt: -1 });
    
    res.json(auctions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get Single Auction Details (Admin view)
exports.getAuctionById = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id)
      .populate('farmer', 'name email farmLocation');
    
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }
    
    // Fetch bids history
    const bids = await Bid.find({ auction: req.params.id })
      .populate('trader', 'name email')
      .sort({ amount: -1 });
    
    res.json({ auction, bids });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get All Transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('farmer', 'name email')
      .populate('trader', 'name email')
      .populate('auction', 'variety quantity location')
      .sort({ transactionDate: -1 });
    
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Terminate/Close Auction manually
exports.terminateAuction = async (req, res) => {
  try {
    const auctionId = req.params.id;
    
    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    if (auction.status !== 'active') {
      return res.status(400).json({ message: 'Auction is not active' });
    }

    // Close the auction using the service
    await closeAuction(auctionId);

    res.json({ message: 'Auction terminated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get Dashboard Statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });
    const totalFarmers = await User.countDocuments({ role: 'farmer' });
    const totalTraders = await User.countDocuments({ role: 'trader' });
    const pendingApprovals = await User.countDocuments({ isApproved: false, role: { $ne: 'admin' } });
    
    const totalAuctions = await Auction.countDocuments();
    const activeAuctions = await Auction.countDocuments({ status: 'active' });
    const closedAuctions = await Auction.countDocuments({ status: 'closed' });
    const completedAuctions = await Auction.countDocuments({ status: 'completed' });
    
    const totalBids = await Bid.countDocuments();
    const totalTransactions = await Transaction.countDocuments();
    
    // Calculate total transaction value
    const transactions = await Transaction.find();
    const totalTransactionValue = transactions.reduce((sum, t) => sum + t.finalAmount, 0);

    res.json({
      users: {
        total: totalUsers,
        farmers: totalFarmers,
        traders: totalTraders,
        pendingApprovals
      },
      auctions: {
        total: totalAuctions,
        active: activeAuctions,
        closed: closedAuctions,
        completed: completedAuctions
      },
      bidding: {
        totalBids,
        totalTransactions,
        totalTransactionValue
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
