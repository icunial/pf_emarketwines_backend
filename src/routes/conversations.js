const express = require("express");
const router = express.Router();

const validations = require("../utils/validations/publications");
const {
  validateId,
  ensureAuthenticated,
} = require("../utils/validations/index");

module.exports = router;
