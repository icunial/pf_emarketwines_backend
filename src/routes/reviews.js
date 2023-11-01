const express = require("express");
const router = express.Router();

const Review = require("../models/Review");

const validations = require("../utils/validations/reviews");

const {
  validateId,
  ensureAuthenticated,
} = require("../utils/validations/index");

const { getProductbyId } = require("../controllers/products");
const { getReviews } = require("../controllers/reviews");

// Get product reviews
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  if (!validateId(id)) {
    return res.status(400).json({
      statusCode: 400,
      msg: `ID invalid format!`,
    });
  }

  try {
    const product = await getProductbyId(id);

    if (!product.length) {
      return res.status(404).json({
        statusCode: 404,
        msg: `Product with ID: ${id} not found!`,
      });
    }

    const reviews = await getReviews(id);

    if (!reviews.length) {
      return res.status(404).json({
        statusCode: 404,
        msg: "This product does not have reviews!",
      });
    }

    res.status(200).json({
      statusCode: 200,
      data: reviews,
    });
  } catch (error) {
    return next(error);
  }
});

// Create new review
router.post("/", ensureAuthenticated, async (req, res, next) => {
  const { text, productId } = req.body;

  if (req.user.isSommelier === false) {
    return res.status(401).json({
      statusCode: 401,
      msg: "You are not authorized! You have to be a sommelier...",
    });
  }

  if (!productId) {
    return res.status(400).json({
      statusCode: 400,
      msg: "Product Id is missing",
    });
  }

  if (!validateId(productId)) {
    return res.status(400).json({
      statusCode: 400,
      msg: `ID invalid format!`,
    });
  }

  try {
    const product = await getProductbyId(productId);

    if (!product.length) {
      return res.status(404).json({
        statusCode: 404,
        msg: `Product with ID: ${productId} not found!`,
      });
    }

    const reviewFound = await Review.findOne({
      where: {
        userId: req.user.id,
        productId,
      },
    });

    if (reviewFound) {
      return res.status(400).json({
        statusCode: 400,
        msg: `You can only leave one review!`,
      });
    }

    if (validations.validateText(text)) {
      return res.status(400).json({
        statusCode: 400,
        msg: validations.validateText(text),
      });
    }

    const review = await Review.create({
      text,
      productId,
      userId: req.user.id,
    });

    res.status(201).json({
      statusCode: 201,
      data: review,
    });
  } catch (error) {
    return next("Error trying to create a new review");
  }
});

module.exports = router;
