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

    if (dbResults) {
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
    }

    return results;
  } catch (error) {
    throw new Error("Error trying to get all publications from DB!");
  }
};

// Get publication by Id
const getPublicationById = async (id) => {
  const result = [];

  try {
    const dbResult = await Publication.findByPk(id);

    if (dbResult) {
      result.push({
        id: dbResult.id,
        title: dbResult.title,
        price: dbResult.price,
        amount: dbResult.amount,
        image: dbResult.image,
        description: dbResult.description,
      });
    }

    return result;
  } catch (error) {
    console.log(error.message);
    throw new Error("Error trying to get a publication by its ID");
  }
};

module.exports = {
  getPublications,
  getPublicationById,
};
