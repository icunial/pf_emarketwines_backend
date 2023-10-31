const express = require("express");
const router = express.Router();

const {
  validateId,
  ensureAuthenticated,
} = require("../utils/validations/index");

module.exports = router;
