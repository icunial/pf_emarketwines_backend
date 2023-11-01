const express = require("express");
const router = express.Router();

const {
  validateId,
  ensureAuthenticated,
} = require("../utils/validations/index");

const validations = require("../utils/validations/deliveries");

const { getBuyById } = require("../controllers/buys");

const Delivery = require("../models/Delivery");

// Create new delivery
router.post("/", ensureAuthenticated, async (req, res, next) => {
  const { buyId } = req.body;

  if (!buyId) {
    return res.status(400).json({
      statusCode: 400,
      msg: "Buy ID is missing",
    });
  }

  if (!validateId(buyId)) {
    return res.status(400).json({
      statusCode: 400,
      msg: `ID invalid format!`,
    });
  }

  try {
    const buy = await getBuyById(buyId);

    if (!buy.length) {
      return res.status(404).json({
        statusCode: 404,
        msg: `Buy with ID: ${buyId} not found!`,
      });
    }

    if (buy[0].userId !== req.user.id) {
      return res.status(400).json({
        statusCode: 400,
        msg: `You can not deliver a buy that is not yours!`,
      });
    }

    const delivery = await Delivery.create({
      buyId,
    });

    res.status(201).json({
      statusCode: 201,
      data: delivery,
    });
  } catch (error) {
    return next("Error trying to create a new delivery");
  }
});

module.exports = router;
