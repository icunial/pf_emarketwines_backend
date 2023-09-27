const { DataTypes } = require("sequelize");
const db = require("../db");

const Conversation = db.define("conversation", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
});

module.exports = Conversation;
