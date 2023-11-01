const express = require("express");
const router = express.Router();

const {
  validateId,
  ensureAuthenticated,
} = require("../utils/validations/index");

const validations = require("../utils/validations/questions");

const { getPublicationById } = require("../controllers/publications");
const Question = require("../models/Question");

// Create new question
router.post("/", ensureAuthenticated, async (req, res, next) => {
  const { publicationId, text } = req.body;

  if (!publicationId) {
    return res.status(400).json({
      statusCode: 400,
      msg: "Publication ID is missing",
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

    if (publication[0].username === req.user.username) {
      return res.status(400).json({
        statusCode: 400,
        msg: "You can not ask a question in your publication!",
      });
    }

    if (validations.validateText(text)) {
      return res.status(400).json({
        statusCode: 400,
        msg: validations.validateText(text),
      });
    }

    const question = await Question.create({
      text,
      publicationId,
    });

    res.status(201).json({
      statusCode: 201,
      data: question,
    });
  } catch (error) {
    return next("Error trying to create a new question");
  }
});

module.exports = router;
