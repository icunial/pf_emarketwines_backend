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

// Ban or not user
const updateIsBannedUser = async (id, banned) => {
  try {
    const userFound = await getUserById(id);

    if (!userFound.length) {
      return [];
    }

    const updatedUser = await User.update(
      {
        isBanned: banned,
      },
      {
        where: {
          id,
        },
      }
    );

    if (updatedUser[0] === 1) {
      const userFound = await getUserById(id);

      return userFound;
    }
  } catch (error) {
    throw new Error("Error trying to update the user!");
  }
};

// Makes user sommelier or not
const updateIsSommelierUser = async (id, sommelier) => {
  try {
    const userFound = await getUserById(id);

    if (!userFound.length) {
      return [];
    }

    const updatedUser = await User.update(
      {
        isSommelier: sommelier,
      },
      {
        where: {
          id,
        },
      }
    );

    if (updatedUser[0] === 1) {
      const userFound = await getUserById(id);

      return userFound;
    }
  } catch (error) {
    throw new Error("Error trying to update the user!");
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateIsBannedUser,
  updateIsSommelierUser,
};
