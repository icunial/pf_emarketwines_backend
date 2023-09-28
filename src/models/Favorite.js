const { DataTypes } = require("sequelize");
const db = require("../db");

const Favorite = db.define("favorite", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  isBanned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Favorite;
