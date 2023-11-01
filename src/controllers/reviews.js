const User = require("../models/User");
const Review = require("../models/Review");
const Product = require("../models/Product");

// Get all reviews from a product
const getReviews = async (id) => {
  const results = [];

  try {
    const dbResults = await Review.findAll({
      include: [
        {
          model: User,
        },
        {
          model: Product,
          where: {
            id,
          },
        },
      ],
    });

    if (dbResults) {
      dbResults.forEach((r) => {
        results.push({
          id: r.id,
          text: r.text,
          username: r.user.username,
          email: r.user.email,
        });
      });
    }

    return results;
  } catch (error) {
    throw new Error("Error trying to get all reviews from a product");
  }
};

module.exports = {
  getReviews,
};
