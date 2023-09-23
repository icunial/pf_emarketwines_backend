const express = require("express");
const router = express.Router();

const Product = require("../models/Product");

// Create New Product
router.post("/", async (req, res, next) => {
  const { name, type, varietal, origin, cellar } = req.body;
});

module.exports = router;
