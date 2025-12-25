const Auction = require('../models/Auction');
const Bid = require('../models/Bid');
const Transaction = require('../models/Transaction');

// Close auction and create transaction
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
      
      console.log(`Transaction created for auction ${auctionId}, winner: ${winningBid.trader.name}, amount: ${winningBid.amount}`);
      
      // Update auction status to completed
      auction.status = 'completed';
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
