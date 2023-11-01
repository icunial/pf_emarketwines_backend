const User = require("../models/User");
const Conversation = require("../models/Conversation");
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

module.exports = {
  getConversationByMembers,
};
