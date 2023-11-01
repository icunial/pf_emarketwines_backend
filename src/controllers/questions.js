const Question = require("../models/Question");
const Publication = require("../models/Publication");
const User = require("../models/User");

// Get question by Id
const getQuestionById = async (id) => {
  const result = [];

  try {
    const dbResult = await Question.findByPk(id, {
      include: {
        model: Publication,
      },
    });

    if (dbResult) {
      result.push({
        id: dbResult.id,
        text: dbResult.text,
        answer: dbResult.answer,
        userId: dbResult.publication.userId,
      });
    }

    return result;
  } catch (error) {
    throw new Error("Error trying yo get a question by id");
  }
};

// Get publication questions
const getQuestions = async (id) => {
  const results = [];

  try {
    const dbResults = await Question.findAll({
      include: [
        {
          model: Publication,
          where: {
            id,
          },
        },
        {
          model: User,
        },
      ],
    });

    if (dbResults) {
      dbResults.forEach((r) => {
        results.push({
          id: r.id,
          text: r.text,
          answer: r.answer,
          username: r.user.username,
          email: r.user.email,
        });
      });
    }

    return results;
  } catch (error) {
    throw new Error("Error trying to get publication questions!");
  }
};

module.exports = {
  getQuestionById,
  getQuestions,
};
