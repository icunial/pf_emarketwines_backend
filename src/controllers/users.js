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

module.exports = {
  getUsers,
};
