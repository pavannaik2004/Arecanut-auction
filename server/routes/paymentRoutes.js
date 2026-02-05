const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const  { Transaction, Auction, Bid, User }  = require('../models');

router.use(authMiddleware);

// Create payment (Trader initiates)
router.post('/create', async (req, res) => {
  try {
    const { auctionId, paymentMethod, notes } = req.body;

    if (req.user.role !== 'trader') {
      return res.status(403).json({ message: 'Only traders can initiate payments' });
    }

    const auction = await Auction.findByPk(auctionId, {
      include: [{ model: User, as: 'farmer' }]
    });

    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    if (auction.status !== 'closed' && auction.status !== 'completed') {
      return res.status(400).json({ message: 'Auction must be closed to process payment' });
    }

    // Check if trader won the auction
    const highestBid = await Bid.findOne({
      where: { auctionId: auctionId },
      order: [['amount', 'DESC']],
      include: [{ model: User, as: 'trader' }]
    });

    if (!highestBid || highestBid.traderId !== req.user.id) {
      return res.status(403).json({ message: 'You did not win this auction' });
    }

    // Check if payment already exists
    let payment = await Transaction.findOne({ where: { auctionId: auctionId } });
    
    if (payment) {
        // If payment/transaction exists (e.g. created by auction service), update it
        if (payment.paymentStatus === 'paid') {
             return res.status(400).json({ message: 'Payment already completed for this auction' });
        }
        
        // Update existing transaction
        payment.paymentMethod = paymentMethod;
        payment.notes = notes;
        payment.transactionDate = new Date(); // Update date to actual payment attempt
        // DO NOT set to paid yet unless it's direct? Assuming status stays pending or moves to processing?
        // Original code kept it pending or whatever 'create' default was? 
        // Let's assume we just update details here. 
        // If the original flow allowed creating a 'pending' payment, we do the same.
        await payment.save();
    } else {
        // Create new if not exists
        payment = await Transaction.create({
          auctionId: auctionId,
          traderId: req.user.id,
          farmerId: auction.farmerId,
          finalAmount: highestBid.amount,
          paymentMethod,
          notes,
          paymentStatus: 'pending',
          transactionDate: new Date()
        });
    }

    res.status(201).json({ message: 'Payment initiated successfully', payment });
  } catch (error) {
    console.error('Error in create payment:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Get payments for a trader
router.get('/trader/:id', async (req, res) => {
  try {
    if (req.user.id != req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const payments = await Transaction.findAll({
      where: { traderId: req.params.id },
      include: [
        { model: Auction, as: 'auction', attributes: ['variety', 'quantity'] },
        { model: User, as: 'farmer', attributes: ['name', 'email'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Get payments for a farmer
router.get('/farmer/:id', async (req, res) => {
  try {
    if (req.user.id != req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const payments = await Transaction.findAll({
      where: { farmerId: req.params.id },
      include: [
        { model: Auction, as: 'auction', attributes: ['variety', 'quantity'] },
        { model: User, as: 'trader', attributes: ['name', 'email'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Update payment status (Farmer confirms or Admin overrides)
router.put('/update-status/:id', async (req, res) => {
  try {
    const { status } = req.body;
    
    const payment = await Transaction.findByPk(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Only farmer who received payment or admin can update status
    if (req.user.id !== payment.farmerId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this payment' });
    }

    payment.paymentStatus = status;
    await payment.save();
    
    res.json({ message: 'Payment status updated', payment });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Get all payments (Admin)
router.get('/all', async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
             return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const payments = await Transaction.findAll({
            include: [
                { model: Auction, as: 'auction', attributes: ['variety', 'quantity'] },
                { model: User, as: 'farmer', attributes: ['name'] },
                { model: User, as: 'trader', attributes: ['name'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(payments);
    } catch (error) {
        console.error('Error fetching all payments:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
