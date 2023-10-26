const express = require("express");
const router = express.Router();

const publicationsRouter = require("./publications");
const productsRouter = require("./products.js");
const varietalsRouter = require("./varietals");
const usersRouter = require("./users");
const favoritesRouter = require("./favorites");

// Specify routers root routes
router.use("/publications", publicationsRouter);
router.use("/products", productsRouter);
router.use("/varietals", varietalsRouter);
router.use("/users", usersRouter);
router.use("/favorites", favoritesRouter);

module.exports = router;
