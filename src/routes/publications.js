const express = require("express");
const router = express.Router();

const Publication = require("../models/Publication");
const Product = require("../models/Product");

const validations = require("../utils/validations/publications");
const {
  validateId,
  ensureAuthenticated,
} = require("../utils/validations/index");

const {
  getPublications,
  getPublicationById,
  getPublicationsWithWord,
  orderPublicationsMorePrice,
  orderPublicationsLessPrice,
  orderPublicationsByNameAtoZ,
  orderPublicationsByNameZtoA,
  updateIsBannedPublication,
  updateAmountPublication,
  getPublicationsWithoutId,
  getPublicationsWithWordWithoutId,
  orderPublicationsByNameAtoZWithoutId,
  orderPublicationsByNameZtoAWithoutId,
  orderPublicationsLessPriceWithoutId,
  orderPublicationsMorePriceWithoutId,
  getAllPublications,
  getBannedPublications,
} = require("../controllers/publications");

// Get all publications
router.get("/all", ensureAuthenticated, async (req, res, next) => {
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
    const publications = await getAllPublications();

    if (!publications.length) {
      return res.status(404).json({
        statusCode: 404,
        msg: `No publications saved in DB!`,
      });
    }

    res.status(200).json({
      statusCode: 200,
      data: publications,
    });
  } catch (error) {
    return next(error);
  }
});

// Get all publications
router.get("/banned", ensureAuthenticated, async (req, res, next) => {
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
    const publications = await getBannedPublications();

    if (!publications.length) {
      return res.status(404).json({
        statusCode: 404,
        msg: `No banned publications saved in DB!`,
      });
    }

    res.status(200).json({
      statusCode: 200,
      data: publications,
    });
  } catch (error) {
    return next(error);
  }
});

// Get publication by ID
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  if (!validateId(id)) {
    return res.status(400).json({
      statusCode: 404,
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

    res.status(200).json({
      statusCode: 200,
      data: publication,
    });
  } catch (error) {
    return next(error);
  }
});

// Get not banned publications
router.get("/", async (req, res, next) => {
  const { word } = req.query;

  try {
    if (word) {
      if (req.user) {
        const publications = await getPublicationsWithWordWithoutId(
          req.user.id,
          word
        );

        if (!publications.length) {
          return res.status(404).json({
            statusCode: 404,
            msg: `No publications saved in DB!`,
          });
        }

        return res.status(200).json({
          statusCode: 200,
          data: publications,
        });
      }

      const publicationsWithWord = await getPublicationsWithWord(word);

      if (!publicationsWithWord.length) {
        return res.status(404).json({
          statusCode: 404,
          msg: `Publications with word: ${word} not found!`,
        });
      }

      return res.status(200).json({
        statusCode: 200,
        data: publicationsWithWord,
      });
    }

    if (req.user) {
      const publications = await getPublicationsWithoutId(req.user.id);

      if (!publications.length) {
        return res.status(404).json({
          statusCode: 404,
          msg: `No publications saved in DB!`,
        });
      }

      return res.status(200).json({
        statusCode: 200,
        data: publications,
      });
    }

    const publications = await getPublications();

    if (!publications.length) {
      return res.status(404).json({
        statusCode: 404,
        msg: `No publications saved in DB!`,
      });
    }

    res.status(200).json({
      statusCode: 200,
      data: publications,
    });
  } catch (error) {
    return next(error);
  }
});

// Order features routes
router.get("/order/:opt", async (req, res, next) => {
  const { opt } = req.params;

  let results = [];

  try {
    if (req.user) {
      if (opt === "more") {
        results = await orderPublicationsMorePriceWithoutId(req.user.id);
      } else if (opt === "less") {
        results = await orderPublicationsLessPriceWithoutId(req.user.id);
      } else if (opt === "az") {
        results = await orderPublicationsByNameAtoZWithoutId(req.user.id);
      } else if (opt === "za") {
        results = await orderPublicationsByNameZtoAWithoutId(req.user.id);
      } else {
        return res.status(400).json({
          statusCode: 400,
          msg: `Filter not available!`,
        });
      }

      if (!results.length) {
        return res.status(404).json({
          statusCode: 404,
          msg: `No publications saved in DB!`,
        });
      }

      res.status(200).json({
        statusCode: 200,
        data: results,
      });
    }

    if (opt === "more") {
      results = await orderPublicationsMorePrice();
    } else if (opt === "less") {
      results = await orderPublicationsLessPrice();
    } else if (opt === "az") {
      results = await orderPublicationsByNameAtoZ();
    } else if (opt === "za") {
      results = await orderPublicationsByNameZtoA();
    } else {
      return res.status(400).json({
        statusCode: 400,
        msg: `Filter not available!`,
      });
    }

    if (!results.length) {
      return res.status(404).json({
        statusCode: 404,
        msg: `No publications saved in DB!`,
      });
    }

    res.status(200).json({
      statusCode: 200,
      data: results,
    });
  } catch (error) {
    return next(error);
  }
});

// Create new publication
router.post("/", ensureAuthenticated, async (req, res, next) => {
  const { title, price, amount, image, description, product } = req.body;

  // Validations
  if (validations.validateTitle(title)) {
    return res.status(400).json({
      statusCode: 400,
      msg: validations.validateTitle(title),
    });
  }

  if (validations.validatePrice(price)) {
    return res.status(400).json({
      statusCode: 400,
      msg: validations.validatePrice(price),
    });
  }

  if (validations.validateAmount(amount)) {
    return res.status(400).json({
      statusCode: 400,
      msg: validations.validateAmount(amount),
    });
  }

  if (validations.validateDescription(description)) {
    return res.status(400).json({
      statusCode: 400,
      msg: validations.validateDescription(description),
    });
  }

  try {
    const productExist = await Product.findOne({
      where: {
        name: product,
      },
    });

    if (!productExist) {
      return res.status(404).json({
        statusCode: 404,
        msg: `Product ${product} not found!`,
      });
    }

    const publicationCreated = await Publication.create({
      title,
      price,
      amount,
      image: image ? image : null,
      description,
      productId: productExist.dataValues.id,
      userId: req.user.id,
    });

    res.status(201).json({
      statusCode: 201,
      data: publicationCreated,
    });
  } catch (error) {
    return next("Error trying to create a new publication!");
  }
});

// Update publication amount
router.put("/amount/:id", async (req, res, next) => {
  const { id } = req.params;
  const { amount } = req.query;

  if (!validateId(id)) {
    return res.status(400).json({
      statusCode: 400,
      msg: `ID invalid format!`,
    });
  }

  if (!amount) {
    return res.status(400).json({
      statusCode: 400,
      msg: `Amount parameter is missing`,
    });
  }

  if (!parseInt(amount) && amount !== "0") {
    return res.status(400).json({
      statusCode: 400,
      msg: `Amount must be a number`,
    });
  }

  if (parseInt(amount) < 0) {
    return res.status(400).json({
      statusCode: 400,
      msg: `Amount must be 0 or higher`,
    });
  }

  try {
    const updatedPublication = await updateAmountPublication(id, amount);

    if (!updatedPublication.length) {
      return res.status(404).json({
        statusCode: 404,
        msg: `Publication with ID: ${id} not found!`,
      });
    }

    res.status(200).json({
      statusCode: 200,
      data: updatedPublication,
    });
  } catch (error) {
    return next(error);
  }
});

// Ban or not publications
router.put("/:id", ensureAuthenticated, async (req, res, next) => {
  const { id } = req.params;
  const { banned } = req.query;

  if (
    req.user.dataValues.email !== "admin@ewines.com" &&
    req.user.dataValues.isAdmin === false
  ) {
    return res.status(401).json({
      statusCode: 401,
      msg: "You are not authorized! You must have admin privileges...",
    });
  }

  if (!validateId(id)) {
    return res.status(400).json({
      statusCode: 400,
      msg: `ID invalid format!`,
    });
  }

  if (validations.validateBanned(banned)) {
    return res.status(400).json({
      statusCode: 400,
      msg: validations.validateBanned(banned),
    });
  }

  try {
    const updatedPublication = await updateIsBannedPublication(id, banned);

    if (!updatedPublication.length) {
      return res.status(404).json({
        statusCode: 404,
        msg: `Publication with ID: ${id} not found!`,
      });
    }

    res.status(200).json({
      statusCode: 200,
      data: updatedPublication,
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
