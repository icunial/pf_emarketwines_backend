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
const questionsRouter = require("./questions");
const deliveriesRouter = require("./deliveries");
const conversationsRouter = require("./conversations");
const notificationsRouter = require("./notifications");

// Specify routers root routes
router.use("/publications", publicationsRouter);
router.use("/products", productsRouter);
router.use("/varietals", varietalsRouter);
router.use("/users", usersRouter);
router.use("/favorites", favoritesRouter);
router.use("/buys", buysRouter);
router.use("/reviewBuys", reviewBuysRouter);
router.use("/reviews", reviewsRouter);
router.use("/questions", questionsRouter);
router.use("/deliveries", deliveriesRouter);
router.use("/conversations", conversationsRouter);
router.use("/notifications", notificationsRouter);

module.exports = router;
