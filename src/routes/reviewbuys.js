const express = require("express");
const router = express.Router();

const Buy = require("../models/Buy");
const ReviewBuy = require("../models/ReviewBuy");

const {
  validateId,
  ensureAuthenticated,
} = require("../utils/validations/index");

const validations = require("../utils/validations/reviewBuys");

const { getBuyById, getPublicationBuys } = require("../controllers/buys.js");
const { getPublicationById } = require("../controllers/publications");
const { getReviewBuys } = require("../controllers/reviewBuys");

// Get all review buys from a publication
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  if (!validateId(id)) {
    return res.status(400).json({
      statusCode: 400,
      msg: `ID invalid format!`,
    });
  }

  try {
    const publication = await getPublicationById(id);

    if (!publication.length) {
      return res.status(404).json({
        statusCode: 404,
        msg: `Publication with ID: ${id} not found!`,
      });
    }

    const buys = await getPublicationBuys(id);

    if (!buys.length) {
      return res.status(404).json({
        statusCode: 404,
        msg: `The publication ${id} does not have buys!`,
      });
    }

    const reviewBuys = await getReviewBuys(id);

    if (!reviewBuys.length) {
      return res.status(404).json({
        statusCode: 404,
        msg: "This publication does not have review buys!",
      });
    }

    res.status(200).json({
      statusCode: 200,
      data: reviewBuys,
    });
  } catch (error) {
    return next(error);
  }
});

// Create new review buy
router.post("/", ensureAuthenticated, async (req, res, next) => {
  const { stars, text, buyId } = req.body;

  if (!buyId) {
    return res.status(400).json({
      statusCode: 400,
      msg: "Buy ID parameter is missing",
    });
  }

  if (!validateId(buyId)) {
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
        msg: `Buy with ID: ${buyId} not found!`,
      });
    }

    if (buyFound[0].username !== req.user.username) {
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
