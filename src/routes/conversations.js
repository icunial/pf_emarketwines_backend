const express = require("express");
const router = express.Router();

const validations = require("../utils/validations/conversations");
const {
  validateId,
  ensureAuthenticated,
} = require("../utils/validations/index");

const { getUserById } = require("../controllers/users");
const { getConversationByMembers } = require("../controllers/conversations");

const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

// Create new message
router.post("/message", ensureAuthenticated, async (req, res, next) => {
  const { userId, text } = req.body;

  if (!userId) {
    return res.status(400).json({
      statusCode: 400,
      msg: "User ID is missing",
    });
  }

  if (!validateId(userId)) {
    return res.status(400).json({
      statusCode: 404,
      msg: `ID invalid format!`,
    });
  }

  try {
    const user = await getUserById(userId);

    if (!user.length) {
      return res.status(404).json({
        statusCode: 404,
        msg: `User with ID: ${userId} not found!`,
      });
    }

    if (user[0].id === req.user.id) {
      return res.status(400).json({
        statusCode: 400,
        msg: "You can not send a message to yourself!",
      });
    }

    if (validations.validateText(text)) {
      return res.status(400).json({
        statusCode: 400,
        msg: validations.validateText(text),
      });
    }

    const conversationFound = await getConversationByMembers(
      req.user.id,
      userId
    );

    if (!conversationFound.length) {
      const conversation = await Conversation.create();
      if (conversation) {
        await conversation.addUser(req.user.id);
        await conversation.addUser(userId);

        const message = await Message.create({
          text,
          userId: req.user.id,
          conversationId: conversation.id,
        });

        return res.status(201).json({
          statusCode: 201,
          data: message,
        });
      }
    }

    const message = await Message.create({
      text,
      userId: req.user.id,
      conversationId: conversationFound.id,
    });

    res.status(201).json({
      statusCode: 201,
      data: message,
    });
  } catch (error) {
    throw new Error("Error trying to create a new message in a conversation");
  }
});

module.exports = router;
