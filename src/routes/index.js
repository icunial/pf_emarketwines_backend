const express = require("express");
const router = express.Router();

const publicationsRouter = require("./publications");
const productsRouter = require("./products.js");
const varietalsRouter = require("./varietals");

// Specify routers root routes
router.use("/publications", publicationsRouter);
router.use("/products", productsRouter);
router.use("/varietals", varietalsRouter);

module.exports = router;
