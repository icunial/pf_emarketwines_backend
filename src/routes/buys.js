const express = require("express");
const router = express.Router();

const Publication = require("../models/Publication");
const Buy = require("../models/Buy");
const Notification = require("../models/Notification");

const validations = require("../utils/validations/buys");

const {
  validateId,
  ensureAuthenticated,
} = require("../utils/validations/index");

const {
  getAllBuys,
  getBuyById,
  getUserBuys,
  getUserSales,
  getPublicationBuys,
} = require("../controllers/buys");

const { getPublicationById } = require("../controllers/publications");

// Get user buys
router.get("/own", ensureAuthenticated, async (req, res, next) => {
  try {
    const buys = await getUserBuys(req.user.id);

    if (!buys.length) {
      return res.status(404).json({
        statusCode: 404,
        msg: "You have no buys!",
      });
    }

    res.status(200).json({
      statusCode: 200,
      data: buys,
    });
  } catch (error) {
    return next(error);
  }
});

// Get user sales
router.get("/sales", ensureAuthenticated, async (req, res, next) => {
  try {
    const sales = await getUserSales(req.user.id);

    if (!sales.length) {
      return res.status(404).json({
        statusCode: 404,
        msg: "You have no sales!",
      });
    }

    res.status(200).json({
      statusCode: 200,
      data: sales,
    });
  } catch (error) {
    return next(error);
  }
});

// Get publication buys
router.get("/publication/:id", ensureAuthenticated, async (req, res, next) => {
  const { id } = req.params;

  if (!validateId(id)) {
    return res.status(400).json({
      statusCode: 400,
      msg: `ID invalid format!`,
    });
  }
  try {
    const publication = await getPublicationById(id);

    if (!publication.length) {
      return res.status(404).json({
        statusCode: 404,
        msg: `Publication with ID: ${id} not found!`,
      });
    }

    const buys = await getPublicationBuys(id);

    if (!buys.length) {
      return res.status(404).json({
        statusCode: 404,
        msg: `The publication ${id} does not have buys!`,
      });
    }

    res.status(200).json({
      statusCode: 200,
      buysAmount: buys.length,
      data: buys,
    });
  } catch (error) {
    return next(error);
  }
});

// Get buy by id
router.get("/:id", ensureAuthenticated, async (req, res, next) => {
  const { id } = req.params;

  if (!validateId(id)) {
    return res.status(400).json({
      statusCode: 400,
      msg: `ID invalid format!`,
    });
  }

  try {
    const buy = await getBuyById(id);

    if (!buy.length) {
      return res.status(404).json({
        statusCode: 404,
        msg: `Buy with ID: ${id} not found!`,
      });
    }

    if (
      req.user.email !== "admin@ewines.com" &&
      req.user.isAdmin === false &&
      req.user.username !== buy[0].username
    ) {
      return res.status(401).json({
        statusCode: 401,
        msg: "You are not authorized! You can not access to a buy that is not yours...",
      });
    }

    res.status(200).json({
      statusCode: 200,
      data: buy,
    });
  } catch (error) {
    return next(error);
  }
});

// Get all buys
router.get("/", ensureAuthenticated, async (req, res, next) => {
  if (
    req.user.dataValues.email !== "admin@ewines.com" &&
    req.user.dataValues.isAdmin === false
  ) {
    return res.status(401).json({
      statusCode: 401,
      msg: "You are not authorized! You must have admin privileges...",
    });
  }
  try {
    const buys = await getAllBuys();

    if (!buys.length) {
      return res.status(404).json({
        statusCode: 404,
        msg: "No Buys saved in DB!",
      });
    }

    res.status(200).json({
      statusCode: 200,
      data: buys,
    });
  } catch (error) {
    return next(error);
  }
});

// Create new buy
router.post("/", ensureAuthenticated, async (req, res, next) => {
  const { publicationId, currency, paymentMethod } = req.body;

  // Validations
  if (validations.validateCurrency(currency)) {
    return res.status(400).json({
      statusCode: 400,
      msg: validations.validateCurrency(currency),
    });
  }

  if (validations.validatePaymentMethod(paymentMethod)) {
    return res.status(400).json({
      statusCode: 400,
      msg: validations.validatePaymentMethod(paymentMethod),
    });
  }

  if (!publicationId) {
    return res.status(400).json({
      statusCode: 400,
      msg: "Publication ID parameter is missing",
    });
  }

  if (!validateId(publicationId)) {
    return res.status(400).json({
      statusCode: 400,
      msg: `ID invalid format!`,
    });
  }

  try {
    const publication = await getPublicationById(publicationId);

    if (!publication.length) {
      return res.status(404).json({
        statusCode: 404,
        msg: `Publication with ID: ${publicationId} not found!`,
      });
    }

    if (publication[0].isBanned === true) {
      return res.status(400).json({
        statusCode: 400,
        msg: "You can not buy a banned publication!",
      });
    }

    if (publication[0].amount === 0) {
      return res.status(400).json({
        statusCode: 400,
        msg: "Publication does not have stock!",
      });
    }

    if (publication[0].username === req.user.username) {
      return res.status(400).json({
        statusCode: 400,
        msg: "You can not buy your own publication!",
      });
    }

    const buyCreated = await Buy.create({
      currency: currency.toUpperCase(),
      paymentMethod: paymentMethod.toUpperCase(),
      totalAmount: publication[0].price,
      publicationId,
      userId: req.user.id,
    });

    if (buyCreated) {
      await Notification.create({
        userId: publication[0].userId,
        text: `${req.user.username} bought your publication: ${publication[0].title}`,
      });
    }

    res.status(201).json({
      statusCode: 201,
      data: buyCreated,
    });
  } catch (error) {
    return next("Error trying to create a new buy");
  }
});

module.exports = router;
