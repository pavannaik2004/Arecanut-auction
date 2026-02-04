const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Bid = sequelize.define(
  "Bid",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    auctionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Auctions",
        key: "id",
      },
    },
    traderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    time: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        fields: ["auctionId", "amount"],
      },
      {
        fields: ["traderId", "time"],
      },
    ],
  },
);

module.exports = Bid;
