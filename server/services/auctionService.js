const Auction = require('../models/Auction');
const Bid = require('../models/Bid');
const Transaction = require('../models/Transaction');
const Payment = require('../models/Payment');

// Close auction and create transaction + payment record
async function closeAuction(auctionId) {
  try {
    const auction = await Auction.findById(auctionId);
    
    if (!auction) {
      console.error(`Auction ${auctionId} not found`);
      return;
    }

    // Get winning bid (highest amount)
    const winningBid = await Bid.findOne({ auction: auctionId })
      .sort({ amount: -1 })
      .limit(1)
      .populate('trader', 'name email');

    if (winningBid) {
      // Create transaction
      const transaction = new Transaction({
        auction: auctionId,
        farmer: auction.farmer,
        trader: winningBid.trader._id,
        finalAmount: winningBid.amount,
        paymentStatus: 'pending',
        transactionDate: new Date()
      });
      
      await transaction.save();
      
      // Create payment record for the winning trader
      const existingPayment = await Payment.findOne({ auction: auctionId });
      if (!existingPayment) {
        const payment = new Payment({
          auction: auctionId,
          trader: winningBid.trader._id,
          farmer: auction.farmer,
          amount: winningBid.amount,
          status: 'pending',
          paymentMethod: 'upi', // Default method, trader can change when paying
          transactionId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        });
        await payment.save();
        console.log(`Payment record created for auction ${auctionId}`);
      }
      
      console.log(`Transaction created for auction ${auctionId}, winner: ${winningBid.trader.name}, amount: ${winningBid.amount}`);
      
      // Update auction status to closed (will be completed after payment)
      auction.status = 'closed';
    } else {
      // No bids, just close
      auction.status = 'closed';
      console.log(`Auction ${auctionId} closed with no bids`);
    }

    await auction.save();
    return auction;
    
  } catch (error) {
    console.error(`Error closing auction ${auctionId}:`, error);
    throw error;
  }
}

// Check and close expired auctions
async function checkAndCloseExpiredAuctions() {
  try {
    const now = new Date();
    
    // Find all active auctions that have expired
    const expiredAuctions = await Auction.find({
      status: 'active',
      endTime: { $lte: now }
    });

    console.log(`Found ${expiredAuctions.length} expired auctions to close`);

    for (const auction of expiredAuctions) {
      await closeAuction(auction._id);
    }

    return expiredAuctions.length;
  } catch (error) {
    console.error('Error in checkAndCloseExpiredAuctions:', error);
    throw error;
  }
}

module.exports = {
  closeAuction,
  checkAndCloseExpiredAuctions
};
