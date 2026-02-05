const { Auction, User } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

exports.getMarketStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all completed auctions
    const completedAuctions = await Auction.findAll({
      where: {
        status: 'completed'
      },
      include: [
        { model: User, as: 'farmer', attributes: ['name'] }
      ],
      order: [['updatedAt', 'DESC']]
    });

    // Calculate Summary Stats
    const totalAuctions = completedAuctions.length;
    
    // Today's auctions
    const todayAuctions = completedAuctions.filter(a => new Date(a.updatedAt) >= today);
    
    const calculateStats = (auctions) => {
      if (!auctions.length) return { avgPrice: 0, maxPrice: 0, totalVolume: 0, count: 0 };
      
      const totalVolume = auctions.reduce((sum, a) => sum + a.quantity, 0);
      const totalPriceVolume = auctions.reduce((sum, a) => sum + (a.currentHighestBid * a.quantity), 0);
      const maxPrice = Math.max(...auctions.map(a => a.currentHighestBid));
      
      // Weighted Average Price (Average price per unit)
      const avgPrice = totalVolume ? (totalPriceVolume / totalVolume) : 0;

      return {
        avgPrice: parseFloat(avgPrice.toFixed(2)),
        maxPrice,
        totalVolume,
        count: auctions.length
      };
    };

    const overallStats = calculateStats(completedAuctions);
    const todayStats = calculateStats(todayAuctions);

    res.json({
      summary: {
        overall: overallStats,
        today: todayStats
      },
      auctions: completedAuctions.map(a => ({
        id: a.id,
        variety: a.variety,
        qualityGrade: a.qualityGrade,
        quantity: a.quantity,
        basePrice: a.basePrice,
        winningBid: a.currentHighestBid,
        location: a.location,
        farmerName: a.farmer ? a.farmer.name : 'Unknown',
        completedDate: a.updatedAt
      }))
    });

  } catch (error) {
    console.error('Error fetching market stats:', error);
    res.status(500).json({ message: 'Error fetching market statistics' });
  }
};
