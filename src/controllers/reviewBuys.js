const Publication = require("../models/Publication");
const User = require("../models/User");
const Buy = require("../models/Buy");
const ReviewBuy = require("../models/ReviewBuy");

// Get all review buys from a publication
const getReviewBuys = async (id) => {
  const results = [];

  try {
    const dbResults = await ReviewBuy.findAll({
      include: [
        {
          model: Buy,
          include: {
            model: Publication,
            where: {
              id,
            },
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
          stars: r.stars,
          text: r.text,
          username: r.user.username,
          email: r.user.email,
          publication: r.buy.publication.title,
        });
      });
    }

    return results;
  } catch (error) {
    throw new Error("Error trying to get all review buys from a publication");
  }
};

module.exports = {
  getReviewBuys,
};
