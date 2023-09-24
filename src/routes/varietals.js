const express = require("express");
const router = express.Router();

const Varietal = require("../models/Varietal");

const validations = require("../utils/validations/varietals");
const { validateId } = require("../utils/validations/index");

const {
  getVarietals,
  getVarietalById,
  updateVarietal,
} = require("../controllers/varietals");

// Get all varietals
router.get("/", async (req, res, next) => {
  try {
    const varietals = await getVarietals();

    if (!varietals.length) {
      return res.status(404).json({
        statusCode: 404,
        msg: `No varietals saved in DB!`,
      });
    }

    res.status(200).json({
      statusCode: 200,
      data: varietals,
    });
  } catch (error) {
    return next(error);
  }
});

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
