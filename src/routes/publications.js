const express = require("express");
const router = express.Router();

const Publication = require("../models/Publication");

const validations = require("../utils/validations/publications");

// Create new publication
router.post("/", async (req, res, next) => {
  const { title, price, amount, image, description } = req.body;

  // Validations
  if (validations.validateTitle(title)) {
    return res.status(400).json({
      statusCode: 400,
      msg: validations.validateTitle(title),
    });
  }

  if (validations.validatePrice(price)) {
    return res.status(400).json({
      statusCode: 400,
      msg: validations.validatePrice(price),
    });
  }

  if (validations.validateAmount(amount)) {
    return res.status(400).json({
      statusCode: 400,
      msg: validations.validateAmount(amount),
    });
  }

  if (validations.validateDescription(description)) {
    return res.status(400).json({
      statusCode: 400,
      msg: validations.validateDescription(description),
    });
  }

  try {
    const publicationCreated = await Publication.create({
      title,
      price,
      amount,
      image: image ? image : null,
      description,
    });

    res.status(201).json({
      statusCode: 201,
      data: publicationCreated,
    });
  } catch (error) {
    return next("Error trying to create a new publication!");
  }
});

module.exports = router;
