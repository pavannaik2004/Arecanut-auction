const sequelize = require("../config/database");
const User = require("./User");
const Auction = require("./Auction");
const Bid = require("./Bid");
const Transaction = require("./Transaction");

// Define associations
User.hasMany(Auction, { foreignKey: "farmerId", as: "farmerAuctions" });
Auction.belongsTo(User, { foreignKey: "farmerId", as: "farmer" });

User.hasMany(Bid, { foreignKey: "traderId", as: "traderBids" });
Bid.belongsTo(User, { foreignKey: "traderId", as: "trader" });

Auction.hasMany(Bid, { foreignKey: "auctionId", as: "bids" });
Bid.belongsTo(Auction, { foreignKey: "auctionId", as: "auction" });

Auction.hasOne(Transaction, { foreignKey: "auctionId", as: "transaction" });
Transaction.belongsTo(Auction, { foreignKey: "auctionId", as: "auction" });

User.hasMany(Transaction, { foreignKey: "farmerId", as: "farmerTransactions" });
Transaction.belongsTo(User, { foreignKey: "farmerId", as: "farmer" });

User.hasMany(Transaction, { foreignKey: "traderId", as: "traderTransactions" });
Transaction.belongsTo(User, { foreignKey: "traderId", as: "trader" });

module.exports = {
  sequelize,
  User,
  Auction,
  Bid,
  Transaction,
};
