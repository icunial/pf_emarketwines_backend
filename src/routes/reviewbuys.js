const express = require("express");
const router = express.Router();

const Buy = require("../models/Buy");
const ReviewBuy = require("../models/ReviewBuy");

const {
  validateId,
  ensureAuthenticated,
} = require("../utils/validations/index");

const validations = require("../utils/validations/reviewBuys");

const { getBuyById } = requiere("../controllers/buys.js");

// Create new review buy
router.post("/", ensureAuthenticated, async (req, res, next) => {
  const { stars, text, buyId } = req.body;

  if (!buyId) {
    return res.status(400).json({
      statusCode: 400,
      msg: "Buy ID paratemer is missing",
    });
  }

  if (!validateId(id)) {
    return res.status(400).json({
      statusCode: 400,
      msg: `ID invalid format!`,
    });
  }

  try {
    const buyFound = await getBuyById(buyId);

    if (!buyFound.length) {
      return res.status(404).json({
        statusCode: 404,
        msg: `Buy with ID: ${id} not found!`,
      });
    }

    if (buyFound.username !== req.user.username) {
      return res.status(400).json({
        statusCode: 400,
        msg: `This buy is not yours. You can not leave a review!`,
      });
    }

    const reviewFound = await ReviewBuy.findOne({
      where: {
        userId: req.user.id,
        buyId,
      },
    });

    if (reviewFound) {
      return res.status(400).json({
        statusCode: 400,
        msg: `You can only leave one review!`,
      });
    }

    if (validations.validateStars(stars)) {
      return res.status(400).json({
        statusCode: 400,
        msg: validations.validateStars(stars),
      });
    }

    if (validations.validateText(text)) {
      return res.status(400).json({
        statusCode: 400,
        msg: validations.validateText(text),
      });
    }

    const review = await ReviewBuy.create({
      stars,
      text,
      buyId,
      userId: req.user.id,
    });

    res.status(201).json({
      statusCode: 201,
      data: review,
    });
  } catch (error) {
    return next("Error trying to create a new review buy");
  }
});

module.exports = router;
