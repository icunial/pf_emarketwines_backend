const express = require("express");
const router = express.Router();

const User = require("../models/User");

const validations = require("../utils/validations/users");

// Create new user
router.post("/register", async (req, res, next) => {
  const { password, email } = req.body;

  // Validations
  if (validations.validatePassword(password)) {
    return res.status(400).json({
      statusCode: 400,
      msg: validations.validatePassword(password),
    });
  }

  if (validations.validateEmail(validations.validateEmail(email))) {
    return res.status(400).json({
      statusCode: 400,
      msg: validations.validateEmail(email),
    });
  }
});

module.exports = router;
