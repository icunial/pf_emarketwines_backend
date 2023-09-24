const express = require("express");
const router = express.Router();

const Product = require("../models/Product");

const validations = require("../utils/validations/products");

const { getProducts } = require("../controllers/products");

// Get all products
router.get("/", async (req, res, next) => {
  try {
    const products = await getProducts();

    if (!products.length) {
      return res.status(404).json({
        statusCode: 404,
        msg: `No products saved in DB`,
      });
    }

    res.status(200).json({
      statusCode: 200,
      data: products,
    });
  } catch (error) {
    return next(error);
  }
});

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

  try {
    const productExist = await Product.findOne({
      where: {
        name,
      },
    });

    if (productExist) {
      return res.status(400).json({
        statusCode: 400,
        msg: `Name ${name} exists. Try with another one!`,
      });
    }

    const productCreated = await Product.create({
      name,
      type,
      varietal,
      origin,
      cellar,
      image: image ? image : null,
    });

    res.status(201).json({
      statusCode: 201,
      data: productCreated,
    });
  } catch (error) {
    return next("Error trying to create a new product");
  }
});

module.exports = router;
