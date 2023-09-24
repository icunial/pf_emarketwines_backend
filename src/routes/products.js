const express = require("express");
const router = express.Router();

const Product = require("../models/Product");

const validations = require("../utils/validations/products");

// Create New Product
router.post("/", async (req, res, next) => {
  const { name, type, varietal, origin, cellar, image } = req.body;

  // Validations
  if (validations.validateName(name)) {
    return res.status(400).json({
      statusCode: 400,
      msg: validations.validateName(name),
    });
  }

  if (validations.validateType(type)) {
    return res.status(400).json({
      statusCode: 400,
      msg: validations.validateType(type),
    });
  }

  if (validations.validateVarietal(varietal)) {
    return res.status(400).json({
      statusCode: 400,
      msg: validations.validateVarietal(varietal),
    });
  }

  if (validations.validateOrigin(origin)) {
    return res.status(400).json({
      statusCode: 400,
      msg: validations.validateOrigin(origin),
    });
  }

  if (validations.validateCellar(cellar)) {
    return res.status(400).json({
      statusCode: 400,
      msg: validations.validateCellar(cellar),
    });
  }
});

module.exports = router;
