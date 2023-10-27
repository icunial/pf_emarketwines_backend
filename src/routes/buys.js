const express = require("express");
const router = express.Router();

const Publication = require("../models/Publication");
const Buy = require("../models/Buy");

const validations = require("../utils/validations/buys");

const {
  validateId,
  ensureAuthenticated,
} = require("../utils/validations/index");

// Create new buy
router.post("/", ensureAuthenticated, async (req, res, next) => {
  const { publicationId, currency, paymentMethod, totalAmount } = req.body;

  // Validations
  if (validations.validateCurrency(currency)) {
    return res.status(400).json({
      statusCode: 400,
      msg: validations.validateCurrency(currency),
    });
  }

  if (validations.validatePaymentMethod(paymentMethod)) {
    return res.status(400).json({
      statusCode: 400,
      msg: validations.validatePaymentMethod(paymentMethod),
    });
  }

  if (validations.validateTotalAmount(totalAmount)) {
    return res.status(400).json({
      statusCode: 400,
      msg: validations.validateTotalAmount(totalAmount),
    });
  }
});

module.exports = router;
