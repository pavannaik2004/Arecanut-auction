const Auction = require("../models/Auction");
const Bid = require("../models/Bid");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const { Op } = require("sequelize");

// Close auction and create transaction
async function closeAuction(auctionId) {
  try {
    const auction = await Auction.findByPk(auctionId);

    if (!auction) {
      console.error(`Auction ${auctionId} not found`);
      return;
    }

    // Get winning bid (highest amount)
    const winningBid = await Bid.findOne({
      where: { auctionId },
      include: [
        {
          model: User,
          as: "trader",
          attributes: ["name", "email"],
        },
      ],
      order: [["amount", "DESC"]],
      limit: 1,
    });

    if (winningBid) {
      // Create transaction
      const transaction = await Transaction.create({
        auctionId,
        farmerId: auction.farmerId,
        traderId: winningBid.trader.id,
        finalAmount: winningBid.amount,
        paymentStatus: "pending",
        transactionDate: new Date(),
      });

      console.log(
        `Transaction created for auction ${auctionId}, winner: ${winningBid.trader.name}, amount: ${winningBid.amount}`,
      );

      // Update auction status to completed
      auction.status = "completed";
    } else {
      // No bids, just close
      auction.status = "closed";
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
    const expiredAuctions = await Auction.findAll({
      where: {
        status: "active",
        endTime: { [Op.lte]: now },
      },
    });

    console.log(`Found ${expiredAuctions.length} expired auctions to close`);

    for (const auction of expiredAuctions) {
      await closeAuction(auction.id);
    }

    return expiredAuctions.length;
  } catch (error) {
    console.error("Error in checkAndCloseExpiredAuctions:", error);
    throw error;
  }
}

module.exports = {
  closeAuction,
  checkAndCloseExpiredAuctions,
};
