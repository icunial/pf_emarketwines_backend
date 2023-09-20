const Publication = require("../models/Publication");

// Get all publications
const getPublications = async () => {
  const results = [];

  try {
    const dbResults = await Publication.findAll({
      where: {
        isBanned: false,
      },
    });

    dbResults.forEach((r) => {
      results.push({
        id: r.id,
        title: r.title,
        price: r.price,
        amount: r.amount,
        image: r.image,
        description: r.description,
      });
    });

    return results;
  } catch (error) {
    throw new Error("Error trying to get all publications from DB!");
  }
};

module.exports = {
  getPublications,
};
