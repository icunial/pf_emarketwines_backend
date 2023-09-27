const { DataTypes } = require("sequelize");
const db = require("../db");

const Buy = db.define("buy", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  idFront: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  idBack: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

module.exports = Buy;
