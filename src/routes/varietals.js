const express = require("express");
const router = express.Router();

const Varietal = require("../models/Varietal");

const validations = require("../utils/validations/varietals");
const { validateId } = require("../utils/validations/index");

const {
  getVarietals,
  getVarietalById,
  updateVarietal,
  deleteVarietal,
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

// Get varietal by ID
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  if (!validateId(id)) {
    return res.status(400).json({
      statusCode: 400,
      msg: `ID invalid format!`,
    });
  }

  try {
    const varietal = await getVarietalById(id);

    if (!varietal.length) {
      return res.status(404).json({
        statusCode: 404,
        msg: `Varietal with ID: ${id} not found!`,
      });
    }

    res.status(200).json({
      statusCode: 200,
      data: varietal,
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
        msg: `Varietal ${name} exists. Try with another one!`,
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

// Update Varietal
router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!validateId(id)) {
    return res.status(400).json({
      statusCode: 404,
      msg: `ID invalid format!`,
    });
  }

  if (!name && !description) {
    return res.status(400).json({
      statusCode: 400,
      msg: `Name and description are both empty!`,
    });
  }

  if (name) {
    if (typeof name !== "string") {
      return res.status(400).json({
        statusCode: 400,
        msg: `Name must be a string`,
      });
    }
  }

  if (description) {
    if (typeof description !== "string") {
      return res.status(400).json({
        statusCode: 400,
        msg: `Description must be a string`,
      });
    }
  }

  try {
    const updatedVarietal = await updateVarietal(id, name, description);

    if (!updatedVarietal.length) {
      return res.status(404).json({
        statusCode: 404,
        msg: `Varietal with ID: ${id} not found!`,
      });
    }

    res.status(200).json({
      statusCode: 200,
      data: updatedVarietal,
    });
  } catch (error) {
    return next(error);
  }
});

// Delete Varietal
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  if (!validateId(id)) {
    return res.status(400).json({
      statusCode: 404,
      msg: `ID invalid format!`,
    });
  }

  try {
    const deletedVarietal = await deleteVarietal(id);

    if (!deletedVarietal.length) {
      return res.status(404).json({
        statusCode: 404,
        msg: `Varietal with ID: ${id} not found!`,
      });
    }

    res.status(200).json({
      statusCode: 200,
      data: deletedVarietal,
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
