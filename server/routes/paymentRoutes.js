const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Payment = require('../models/Payment');
const Auction = require('../models/Auction');
const Bid = require('../models/Bid');
const Transaction = require('../models/Transaction');

router.use(authMiddleware);

// Create payment (Trader initiates)
router.post('/create', async (req, res) => {
  try {
    const { auctionId, paymentMethod, notes } = req.body;

    if (req.user.role !== 'trader') {
      return res.status(403).json({ message: 'Only traders can initiate payments' });
    }

    const auction = await Auction.findById(auctionId).populate('farmer');
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    if (auction.status !== 'closed' && auction.status !== 'completed') {
      return res.status(400).json({ message: 'Auction must be closed to process payment' });
    }

    // Check if trader won the auction
    const highestBid = await Bid.findOne({ auction: auctionId })
      .sort({ amount: -1 })
      .populate('trader');

    if (!highestBid || highestBid.trader._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You did not win this auction' });
    }

    // Check if payment already exists
    const existingPayment = await Payment.findOne({ auction: auctionId });
    if (existingPayment) {
      return res.status(400).json({ message: 'Payment already exists for this auction' });
    }

    const payment = new Payment({
      auction: auctionId,
      trader: req.user.id,
      farmer: auction.farmer._id,
      amount: highestBid.amount,
      paymentMethod,
      notes,
      transactionId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      status: 'pending'
    });

    await payment.save();

    res.status(201).json({ message: 'Payment initiated successfully', payment });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Complete payment (Mock payment completion)
router.put('/complete/:id', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (req.user.role !== 'trader' || payment.trader.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (payment.status !== 'pending') {
      return res.status(400).json({ message: 'Payment already processed' });
    }

    payment.status = 'completed';
    payment.paymentDate = new Date();
    await payment.save();

    // Update auction status to completed
    await Auction.findByIdAndUpdate(payment.auction, { status: 'completed' });

    // Update transaction payment status
    await Transaction.findOneAndUpdate(
      { auction: payment.auction },
      { paymentStatus: 'paid' }
    );

    res.json({ message: 'Payment completed successfully', payment });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Get trader payments
router.get('/trader/my-payments', async (req, res) => {
  try {
    if (req.user.role !== 'trader') {
      return res.status(403).json({ message: 'Traders only' });
    }

    const payments = await Payment.find({ trader: req.user.id })
      .populate('auction', 'variety quantity location image')
      .populate('farmer', 'name email farmLocation')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Get trader pending payments (for dashboard notification)
router.get('/trader/pending-payments', async (req, res) => {
  try {
    if (req.user.role !== 'trader') {
      return res.status(403).json({ message: 'Traders only' });
    }

    const pendingPayments = await Payment.find({ 
      trader: req.user.id,
      status: 'pending'
    })
      .populate('auction', 'variety quantity location image endTime')
      .populate('farmer', 'name email farmLocation')
      .sort({ createdAt: -1 });

    res.json(pendingPayments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Get farmer payments
router.get('/farmer/my-payments', async (req, res) => {
  try {
    if (req.user.role !== 'farmer') {
      return res.status(403).json({ message: 'Farmers only' });
    }

    const payments = await Payment.find({ farmer: req.user.id })
      .populate('auction', 'variety quantity location image')
      .populate('trader', 'name email')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Get farmer pending payments (for dashboard notification)
router.get('/farmer/pending-payments', async (req, res) => {
  try {
    if (req.user.role !== 'farmer') {
      return res.status(403).json({ message: 'Farmers only' });
    }

    const pendingPayments = await Payment.find({ 
      farmer: req.user.id,
      status: 'pending'
    })
      .populate('auction', 'variety quantity location image endTime')
      .populate('trader', 'name email')
      .sort({ createdAt: -1 });

    res.json(pendingPayments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Get all payments (Admin)
router.get('/admin/all-payments', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admins only' });
    }

    const payments = await Payment.find()
      .populate('auction', 'variety quantity location')
      .populate('trader', 'name email')
      .populate('farmer', 'name email farmLocation')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Get payment by auction ID
router.get('/auction/:auctionId', async (req, res) => {
  try {
    const payment = await Payment.findOne({ auction: req.params.auctionId })
      .populate('auction', 'variety quantity location')
      .populate('trader', 'name email')
      .populate('farmer', 'name email farmLocation');

    if (!payment) {
      return res.status(404).json({ message: 'No payment found for this auction' });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
