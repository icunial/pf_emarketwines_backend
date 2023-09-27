const { DataTypes } = require("sequelize");
const { db } = require("../db");

const Delivery = db.define("delivery", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "PENDING",
    allowNull: false,
  },
});

module.exports = Delivery;
