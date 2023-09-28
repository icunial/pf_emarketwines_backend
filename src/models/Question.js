const { DataTypes } = require("sequelize");
const db = require("../db");

const Question = db.define("question", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  answer: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Question;
