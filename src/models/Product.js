const { DataTypes } = require("sequelize");
const db = require("../db");

const Product = db.define("product", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
    primaryKey: true,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  varietal: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  origin: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.TEXT,
    defaultValue: null,
  },
  cellar: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Product;
