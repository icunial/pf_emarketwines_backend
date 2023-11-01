const express = require("express");
const router = express.Router();

const {
  validateId,
  ensureAuthenticated,
} = require("../utils/validations/index");

const validations = require("../utils/validations/questions");

const { getPublicationById } = require("../controllers/publications");
const { getQuestionById, getQuestions } = require("../controllers/questions");

const Question = require("../models/Question");

// Get publication questions
router.get("/publication/:id", async (req, res, next) => {
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

    const questions = await getQuestions(id);

    if (!questions.length) {
      return res.status(404).json({
        statusCode: 404,
        msg: `Publication ${publication[0].title} does not have questions!`,
      });
    }

    res.status(200).json({
      statusCode: 200,
      data: questions,
    });
  } catch (error) {
    return next(error);
  }
});

// Create new answer
router.put("/answer/:id", ensureAuthenticated, async (req, res, next) => {
  const { id } = req.params;
  const { answer } = req.body;

  if (!validateId(id)) {
    return res.status(400).json({
      statusCode: 400,
      msg: `ID invalid format!`,
    });
  }

  try {
    const question = await getQuestionById(id);

    if (!question.length) {
      return res.status(404).json({
        statusCode: 404,
        msg: `Question with ID: ${id} not found!`,
      });
    }

    if (question[0].userId !== req.user.id) {
      return res.status(400).json({
        statusCode: 400,
        msg: "You can not answer questions in publication that is not yours",
      });
    }

    if (question[0].answer !== null) {
      return res.status(400).json({
        statusCode: 400,
        msg: "You have already answered this question",
      });
    }

    if (validations.validateAnswer(answer)) {
      return res.status(400).json({
        statusCode: 400,
        msg: validations.validateAnswer(answer),
      });
    }

    const updateQuestion = await Question.update(
      { answer },
      {
        where: {
          id,
        },
      }
    );

    if (updateQuestion[0] === 1) {
      const questionFound = await getQuestionById(id);

      res.status(200).json({
        statusCode: 200,
        data: questionFound,
      });
    }
  } catch (error) {
    return next(error);
  }
});

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
      userId: req.user.id,
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
