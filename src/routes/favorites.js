const express = require("express");
const router = express.Router();

const Publication = require("../models/Publication");
const Favorite = require("../models/Favorite");

const { getPublicationById } = require("../controllers/publications");

const {
  validateId,
  ensureAuthenticated,
} = require("../utils/validations/index");

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

module.exports = router;
