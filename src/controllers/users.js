const User = require("../models/User");

// Get all users
const getUsers = async () => {
  const results = [];

  try {
    const dbResults = await User.findAll();

    if (dbResults) {
      dbResults.forEach((r) => {
        results.push({
          id: r.id,
          username: r.username,
          email: r.email,
          image: r.image,
          region: r.region,
          phone: r.phone,
          buyLevel: r.buyLevel,
          balance: r.balance,
          isSommelier: r.isSommelier,
          isBanned: r.isBanned,
          isVerified: r.isVerified,
        });
      });
    }

    return results;
  } catch (error) {
    throw new Error("Error trying to get all users from DB!");
  }
};

// Get User by its ID
const getUserById = async (id) => {
  const result = [];

  try {
    const dbResult = await User.findByPk(id);

    if (dbResult) {
      result.push({
        id: dbResult.id,
        username: dbResult.username,
        email: dbResult.email,
        image: dbResult.image,
        region: dbResult.region,
        phone: dbResult.phone,
        buyLevel: dbResult.buyLevel,
        balance: dbResult.balance,
        isSommelier: dbResult.isSommelier,
        isBanned: dbResult.isBanned,
        isVerified: dbResult.isVerified,
      });
    }

    return result;
  } catch (error) {
    throw new Error("Error trying to get a user by its ID");
  }
};

module.exports = {
  getUsers,
  getUserById,
};
