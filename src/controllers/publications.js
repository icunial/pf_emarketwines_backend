const Publication = require("../models/Publication");

const { Op } = require("sequelize");

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
        isBanned: dbResult.isBanned,
      });
    }

    return result;
  } catch (error) {
    console.log(error.message);
    throw new Error("Error trying to get a publication by its ID");
  }
};

// Get publications by Word
const getPublicationsWithWord = async (word) => {
  const results = [];

  try {
    const dbResults = await Publication.findAll({
      where: {
        isBanned: false,
        [Op.or]: [
          {
            title: {
              [Op.iLike]: `%${word}%`,
            },
          },
          {
            description: {
              [Op.iLike]: `%${word}%`,
            },
          },
        ],
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
    throw new Error("Error trying to get publications containing a word!");
  }
};

// Get publications ordered from highest price to lowest
const orderPublicationsMorePrice = async () => {
  const results = [];

  try {
    const dbResults = await Publication.findAll({
      where: {
        isBanned: false,
      },
      order: [["price", "DESC"]],
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
    throw new Error(
      "Error trying to order publications from highest price to lowest"
    );
  }
};

// Get publications ordered from lowest price to highest
const orderPublicationsLessPrice = async () => {
  const results = [];

  try {
    const dbResults = await Publication.findAll({
      where: {
        isBanned: false,
      },
      order: [["price", "ASC"]],
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
    throw new Error(
      "Error trying to order publications from highest price to lowest"
    );
  }
};

// Get publications ordered by name from A to Z
const orderPublicationsByNameAtoZ = async () => {
  const results = [];

  try {
    const dbResults = await Publication.findAll({
      where: {
        isBanned: false,
      },
      order: [["title", "ASC"]],
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
    throw new Error("Error trying to order publications by name from A to Z");
  }
};

// Get publications ordered by name from Z to A
const orderPublicationsByNameZtoA = async () => {
  const results = [];

  try {
    const dbResults = await Publication.findAll({
      where: {
        isBanned: false,
      },
      order: [["title", "DESC"]],
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
    throw new Error("Error trying to order publications by name from Z to A");
  }
};

// Ban or not publication
const updateIsBannedPublication = async (id, banned) => {
  try {
    const publicationFound = await getPublicationById(id);

    if (!publicationFound.length) {
      return [];
    }

    const updatedPublication = await Publication.update(
      { isBanned: banned },
      {
        where: {
          id,
        },
      }
    );

    if (updatedPublication[0] === 1) {
      const publicationFound = await getPublicationById(id);

      return publicationFound;
    }
  } catch (error) {
    throw new Error("Error trying to update the publication!");
  }
};

// Update amount publication
const updateAmountPublication = async (id, amount) => {
  try {
    const publicationFound = await getPublicationById(id);

    if (!publicationFound.length) {
      return [];
    }

    let updatedPublication;

    if (amount === "0") {
      updatedPublication = await Publication.update(
        { amount, isBanned: true },
        {
          where: {
            id,
          },
        }
      );
    } else {
      updatedPublication = await Publication.update(
        { amount, isBanned: false },
        {
          where: {
            id,
          },
        }
      );
    }

    if (updatedPublication[0] === 1) {
      const publicationFound = await getPublicationById(id);

      return publicationFound;
    }
  } catch (error) {
    throw new Error("Error trying to update the publication!");
  }
};

module.exports = {
  getPublications,
  getPublicationById,
  getPublicationsWithWord,
  orderPublicationsMorePrice,
  orderPublicationsLessPrice,
  orderPublicationsByNameAtoZ,
  orderPublicationsByNameZtoA,
  updateIsBannedPublication,
  updateAmountPublication,
};
