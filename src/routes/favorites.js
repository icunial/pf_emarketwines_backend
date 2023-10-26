const express = require("express");
const router = express.Router();

const Publication = require("../models/Publication");
const Favorite = require("../models/Favorite");
const User = require("../models/User");

const { getPublicationById } = require("../controllers/publications");

const {
  validateId,
  ensureAuthenticated,
} = require("../utils/validations/index");

// Get favorites of a publication
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  const results = [];

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

    const favorites = await Favorite.findAll({
      include: [
        {
          model: Publication,
        },
        {
          model: User,
        },
      ],
      where: {
        publicationId: id,
      },
    });

    if (favorites) {
      favorites.forEach((r) => {
        results.push({
          publication: r.publication.title,
          username: r.user.username,
          email: r.user.email,
        });
      });
    }

    if (!results.length) {
      return res.status(404).json({
        statusCode: 404,
        favorites: results.length,
        data: results,
      });
    }

    res.status(200).json({
      statusCode: 200,
      favorites: results.length,
      data: results,
    });
  } catch (error) {
    return next("Error trying to get all favorites of a publication");
  }
});

// Create a new favorite
router.post("/:id", ensureAuthenticated, async (req, res, next) => {
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

    const favoriteFound = await Favorite.findOne({
      where: {
        publicationId: id,
        userId: req.user.id,
      },
    });

    if (favoriteFound) {
      return res.status(400).json({
        statusCode: 400,
        msg: "You cannot favorite a publication twice!",
      });
    }

    const favorite = await Favorite.create({
      publicationId: id,
      userId: req.user.id,
    });

    if (favorite) {
      return res.status(201).json({
        statusCode: 201,
        msg: `You favorited publication: ${id}!`,
      });
    }
  } catch (error) {
    return next("Error trying to favorite a publication");
  }
});

// Delete a favorite
router.delete("/:id", ensureAuthenticated, async (req, res, next) => {
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

    const favoriteFound = await Favorite.findOne({
      where: {
        publicationId: id,
        userId: req.user.id,
      },
    });

    if (!favoriteFound) {
      return res.status(400).json({
        statusCode: 400,
        msg: "You can not delete a favorite of a publication you did not favorite!",
      });
    }

    const deletedFavorites = await Favorite.destroy({
      where: {
        publicationId: id,
        userId: req.user.id,
      },
    });

    if (deletedFavorites === 1) {
      return res.status(200).json({
        statusCode: 200,
        msg: `You removed your favorite of publication ${id}`,
      });
    }
  } catch (error) {
    return next("Error trying to delete a favorite of a publication");
  }
});

module.exports = router;
