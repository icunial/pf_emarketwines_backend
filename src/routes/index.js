const express = require("express");
const router = express.Router();

const publicationsRouter = require("./publications");
const productsRouter = require("./products.js");
const varietalsRouter = require("./varietals");
const usersRouter = require("./users");
const favoritesRouter = require("./favorites");
const buysRouter = require("./buys");
const reviewBuysRouter = require("./reviewbuys");
const reviewsRouter = require("./reviews");

// Specify routers root routes
router.use("/publications", publicationsRouter);
router.use("/products", productsRouter);
router.use("/varietals", varietalsRouter);
router.use("/users", usersRouter);
router.use("/favorites", favoritesRouter);
router.use("/buys", buysRouter);
router.use("/reviewBuys", reviewBuysRouter);
router.use("/reviews", reviewsRouter);

module.exports = router;
