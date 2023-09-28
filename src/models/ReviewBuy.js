const { DataTypes } = require("sequelize");
const db = require("../db");

const ReviewBuy = db.define("reviewBuy", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  stars: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
    allowNull: false,
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = ReviewBuy;
