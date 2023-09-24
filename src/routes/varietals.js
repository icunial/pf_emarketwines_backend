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
});

module.exports = router;
