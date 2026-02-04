const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Transaction = sequelize.define(
  "Transaction",
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
    farmerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
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
    finalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    paymentStatus: {
      type: DataTypes.ENUM("pending", "paid"),
      defaultValue: "pending",
    },
    transactionDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        fields: ["auctionId"],
      },
      {
        fields: ["farmerId", "transactionDate"],
      },
      {
        fields: ["traderId", "transactionDate"],
      },
      {
        fields: ["paymentStatus"],
      },
    ],
  },
);

module.exports = Transaction;
