const { DataTypes } = require("sequelize");
const db = require("../db");

const Review = db.define("review", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Review;
