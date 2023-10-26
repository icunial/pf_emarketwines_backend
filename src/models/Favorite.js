const { DataTypes } = require("sequelize");
const db = require("../db");

const Favorite = db.define("favorite", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
});

module.exports = Favorite;
