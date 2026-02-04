const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Auction = sequelize.define(
  "Auction",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    farmerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    variety: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    qualityGrade: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    basePrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    currentHighestBid: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.TEXT("long"), // Support for large image URLs or Base64 data
      allowNull: true,
    },
    startTime: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "closed", "completed"),
      defaultValue: "active",
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        fields: ["status", "endTime"],
      },
      {
        fields: ["farmerId", "createdAt"],
      },
      {
        fields: ["location", "variety"],
      },
      {
        fields: ["status", "createdAt"],
      },
    ],
  },
);

module.exports = Auction;
