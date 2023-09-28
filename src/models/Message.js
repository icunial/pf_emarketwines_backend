const { DataTypes } = require("sequelize");
const db = require("../db");

const Message = db.define("message", {
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

module.exports = Message;
