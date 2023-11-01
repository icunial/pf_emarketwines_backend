const User = require("../models/User");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const { Op } = require("sequelize");

// Get conversation by members
const getConversationByMembers = async (member1, member2) => {
  const result = [];

  try {
    const conversationsMember1 = await Conversation.findAll({
      include: {
        model: User,
        where: {
          id: member1,
        },
      },
    });

    if (conversationsMember1) {
      for (let conversation of conversationsMember1) {
        const dbResult = await Conversation.findByPk(conversation.id, {
          include: {
            model: User,
            where: {
              id: member2,
            },
          },
        });

        if (dbResult) {
          result.push({
            id: dbResult.id,
            users: dbResult.users.map((u) => {
              return {
                id: u.id,
                username: u.username,
                email: u.email,
              };
            }),
          });
        }
      }
    }

    return result;
  } catch (error) {
    throw new Error("Error trying to get a conversation by members");
  }
};

// Get conversations
const getConversations = async (id) => {
  const results = [];

  try {
    const dbResults = await Conversation.findAll({
      include: {
        model: User,
        where: {
          id,
        },
      },
    });

    if (dbResults) {
      for (let result of dbResults) {
        const conversation = await Conversation.findByPk(result.id, {
          include: {
            model: User,
            where: {
              id: {
                [Op.not]: id,
              },
            },
          },
        });

        if (conversation) {
          results.push({
            id: conversation.id,
            username: conversation.users[0].username,
          });
        }
      }
    }

    return results;
  } catch (error) {
    throw new Error("Error trying to get all conversations");
  }
};

// Get conversation by id
const getConversationById = async (id, userId) => {
  const results = [];

  try {
    const conversation = await Conversation.findByPk(id, {
      include: {
        model: User,
        where: {
          id: userId,
        },
      },
    });

    if (conversation) {
      const messages = await Message.findAll({
        include: {
          model: User,
        },
        where: {
          conversationId: id,
        },
        order: [["createdAt", "ASC"]],
      });
      messages.forEach((m) => {
        results.push({
          text: m.text,
          username: m.user.username,
          date: m.createdAt,
        });
      });
    }

    return results;
  } catch (error) {
    throw new Error("Error trying to get a conversation by id");
  }
};

module.exports = {
  getConversationByMembers,
  getConversations,
  getConversationById,
};
