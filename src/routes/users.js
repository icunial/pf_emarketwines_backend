const express = require("express");
const router = express.Router();

const User = require("../models/User");

const validations = require("../utils/validations/users");

// Create new user
router.post("/register", async (req, res, next) => {
  const { password } = req.body;

  // Validations
  if (validations.validatePassword(password)) {
    return res.status(400).json({
      statusCode: 400,
      msg: validations.validatePassword(password),
    });
  }
});

module.exports = router;
