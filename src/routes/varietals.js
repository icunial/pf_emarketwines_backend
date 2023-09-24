const express = require("express");
const router = express.Router();

const Varietal = require("../models/Varietal");

const validations = require("../utils/validations/varietals");
const { validateId } = require("../utils/validations/index");

// Create New Varietal
router.post("/", async (req, res, next) => {
  const { name, description } = req.body;

  // Validations
  if (validations.validateName(name)) {
    return res.status(400).json({
      statusCode: 400,
      msg: validations.validateName(name),
    });
  }

  if (validations.validateDescription(description)) {
    return res.status(400).json({
      statusCode: 400,
      msg: validations.validateDescription(description),
    });
  }

  try {
    const varietalExist = await Varietal.findOne({
      where: {
        name,
      },
    });

    if (varietalExist) {
      return res.status(400).json({
        statusCode: 400,
        msg: `Varietal ${varietal} exists. Try with another one!`,
      });
    }

    const varietalCreated = await Varietal.create({
      name,
      description,
    });

    res.status(201).json({
      statusCode: 201,
      data: varietalCreated,
    });
  } catch (error) {
    return next("Error trying to create a new varietal");
  }
});

module.exports = router;
