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

module.exports = {
  getQuestionById,
};
