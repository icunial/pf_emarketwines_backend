const express = require("express");
const router = express.Router();

const publicationsRouter = require("./publications");

// Specify routers root routes
router.use("/publications", publicationsRouter);

module.exports = router;
