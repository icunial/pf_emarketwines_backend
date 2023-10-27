const express = require("express");
const router = express.Router();

const Publication = require("../models/Publication");
const Buy = require("../models/Buy");

const {
  validateId,
  ensureAuthenticated,
} = require("../utils/validations/index");

// Create new buy
router.post("/", ensureAuthenticated, async (req, res, next) => {
  const { publicationId, currency, paymentMethod, totalAmount } = req.body;

  // Validations
});

module.exports = router;
