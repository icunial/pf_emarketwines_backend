const express = require("express");
const router = express.Router();

const Publication = require("../models/Publication");
const Buy = require("../models/Buy");

const validations = require("../utils/validations/buys");

const {
  validateId,
  ensureAuthenticated,
} = require("../utils/validations/index");

const { getPublicationById } = require("../controllers/publications");

// Create new buy
router.post("/", ensureAuthenticated, async (req, res, next) => {
  const { publicationId, currency, paymentMethod } = req.body;

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

  if (!publicationId) {
    return res.status(400).json({
      statusCode: 400,
      msg: "Publication ID parameter is missing",
    });
  }

  if (!validateId(publicationId)) {
    return res.status(400).json({
      statusCode: 400,
      msg: `ID invalid format!`,
    });
  }

  try {
    const publication = await getPublicationById(publicationId);

    if (!publication.length) {
      return res.status(404).json({
        statusCode: 404,
        msg: `Publication with ID: ${publicationId} not found!`,
      });
    }

    if (publication[0].isBanned === true) {
      return res.status(400).json({
        statusCode: 400,
        msg: "You can not buy a banned publication!",
      });
    }

    if (publication[0].amount === 0) {
      return res.status(400).json({
        statusCode: 400,
        msg: "Publication does not have stock!",
      });
    }

    if (publication[0].username === req.user.username) {
      return res.status(400).json({
        statusCode: 400,
        msg: "You can not buy your own publication!",
      });
    }

    const buyCreated = await Buy.create({
      currency: currency.toUpperCase(),
      paymentMethod: paymentMethod.toUpperCase(),
      totalAmount: publication[0].price,
      publicationId,
      userId: req.user.id,
    });

    res.status(201).json({
      statusCode: 201,
      data: buyCreated,
    });
  } catch (error) {
    return next("Error trying to create a new buy");
  }
});

module.exports = router;
