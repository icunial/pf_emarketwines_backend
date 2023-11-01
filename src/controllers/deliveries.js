const User = require("../models/User");
const Buy = require("../models/Buy");
const Delivery = require("../models/Delivery");
const Publication = require("../models/Publication");

// Get delivery by id
const getDeliveryById = async (id) => {
  const result = [];

  try {
    const dbResult = await Delivery.findByPk(id, {
      include: [
        {
          model: Buy,
          include: [
            {
              model: Publication,
            },
            {
              model: User,
            },
          ],
        },
      ],
    });

    if (dbResult) {
      result.push({
        id: dbResult.id,
        status: dbResult.status,
        publication: dbResult.buy.publication.title,
        userId: dbResult.buy.publication.userId,
        username: dbResult.buy.user.username,
        email: dbResult.buy.user.email,
      });
    }

    return result;
  } catch (error) {
    throw new Error("Error trying to get delivery by id");
  }
};

module.exports = {
  getDeliveryById,
};
