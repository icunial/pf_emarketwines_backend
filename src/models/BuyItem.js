const { DataTypes } = require("sequelize");
const db = require("../db");

const BuyItem = db.defin("buyItem", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = BuyItem;
