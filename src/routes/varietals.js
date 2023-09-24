const express = require("express");
const router = express.Router();

const Varietal = require("../models/Varietal");

const { validateId } = require("../utils/validations/index");

module.exports = router;
