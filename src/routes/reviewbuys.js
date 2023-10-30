const express = require("express");
const router = express.Router();

const Buy = require("../models/Buy");

const {
  validateId,
  ensureAuthenticated,
} = require("../utils/validations/index");

module.exports = router;
