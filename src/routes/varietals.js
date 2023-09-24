const express = require("express");
const router = express.Router();

const Varietal = require("../models/Varietal");

const { validateId } = require("../utils/validations/index");

// Create New Varietal
router.post("/", async (req, res, next) => {
  const { name, description } = req.body;
});

module.exports = router;
