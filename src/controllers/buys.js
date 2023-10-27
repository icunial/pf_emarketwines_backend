const Publication = require("../models/Publication");
const User = require("../models/User");
const Buy = require("../models/Buy");

const { Op } = require("sequelize");

// Get all buys
const getAllBuys = async () => {
  const results = [];

  try {
    const dbResults = await Buy.findAll({
      include: [
        {
          model: Publication,
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
          currency: r.currency,
          paymentMethod: r.paymentMethod,
          totalAmount: r.totalAmount,
          publication: r.publication.title,
          username: r.user.username,
        });
      });
    }

    return results;
  } catch (error) {
    throw new Error("Error trying to get all buys");
  }
};

// Get buy by id
const getBuyById = async (id) => {
  const result = [];

  try {
    const dbResult = await Buy.findAll({
      include: [
        {
          model: Publication,
        },
        {
          model: User,
        },
      ],
      where: {
        id,
      },
    });

    if (dbResult) {
      dbResult.forEach((r) => {
        result.push({
          id: r.id,
          currency: r.currency,
          paymentMethod: r.paymentMethod,
          totalAmount: r.totalAmount,
          publication: r.publication.title,
          username: r.user.username,
        });
      });
    }

    return result;
  } catch (error) {
    throw new Error("Error trying to get buy by id");
  }
};

// Get user sales
const getUserSales = async (id) => {
  const results = [];

  try {
    const dbResults = await Buy.findAll({
      include: [
        {
          model: Publication,
          where: {
            userId: id,
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
          currency: r.currency,
          paymentMethod: r.paymentMethod,
          totalAmount: r.totalAmount,
          publication: r.publication.title,
          username: r.user.username,
        });
      });
    }

    return results;
  } catch (error) {
    throw new Error("Error trying to get all user sales");
  }
};

// Get user buys
const getUserBuys = async (id) => {
  const results = [];

  try {
    const dbResults = await Buy.findAll({
      include: [
        {
          model: Publication,
        },
        {
          model: User,
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
          currency: r.currency,
          paymentMethod: r.paymentMethod,
          totalAmount: r.totalAmount,
          publication: r.publication.title,
          username: r.user.username,
        });
      });
    }

    return results;
  } catch (error) {
    throw new Error("Error trying to get all buys");
  }
};

// Get publication buys
const getPublicationBuys = async (id) => {
  const results = [];

  try {
    const dbResults = await Buy.findAll({
      include: [
        {
          model: Publication,
          where: {
            id,
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
          currency: r.currency,
          paymentMethod: r.paymentMethod,
          totalAmount: r.totalAmount,
          publication: r.publication.title,
          username: r.user.username,
        });
      });
    }

    return results;
  } catch (error) {
    throw new Error("Error trying to get all buys");
  }
};

module.exports = {
  getAllBuys,
  getBuyById,
  getUserSales,
  getUserBuys,
  getPublicationBuys,
};
