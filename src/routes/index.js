const express = require("express");
const router = express.Router();

const publicationsRouter = require("./publications");
const productsRouter = require("./products.js");

// Specify routers root routes
router.use("/publications", publicationsRouter);
router.use("/products", productsRouter);

module.exports = router;
