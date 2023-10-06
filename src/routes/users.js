const express = require("express");
const router = express.Router();

const User = require("../models/User");

const validations = require("../utils/validations/users");

// Create new user
router.post("/register", async (req, res, next) => {
  const { password, email, username, region, phone } = req.body;

  // Validations
  if (validations.validatePassword(password)) {
    return res.status(400).json({
      statusCode: 400,
      msg: validations.validatePassword(password),
    });
  }

  if (validations.validateEmail(email.toLowerCase())) {
    return res.status(400).json({
      statusCode: 400,
      msg: validations.validateEmail(email.toLowerCase()),
    });
  }

  if (validations.validateUsername(username)) {
    return res.status(400).json({
      statusCode: 400,
      msg: validations.validateUsername(username),
    });
  }

  if (validations.validateRegion(region)) {
    return res.status(400).json({
      statusCode: 400,
      msg: validations.validateRegion(region),
    });
  }

  if (validations.validatePhone(phone)) {
    return res.status(400).json({
      statusCode: 400,
      msg: validations.validatePhone(phone),
    });
  }

  try {
    const emailExist = await User.findOne({
      where: {
        email,
      },
    });

    if (emailExist) {
      return res.status(400).json({
        statusCode: 400,
        msg: `Email ${email} exists! Try with another one!`,
      });
    }
  } catch (error) {
    return next("Error trying to register a new user");
  }
});

module.exports = router;
