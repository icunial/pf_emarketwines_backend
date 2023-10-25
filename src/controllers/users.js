const { Op } = require("sequelize");
const User = require("../models/User");

const bcrypt = require("bcryptjs");

// Get all users
const getUsers = async () => {
  const results = [];

  try {
    const dbResults = await User.findAll({
      where: {
        email: {
          [Op.not]: "admin@ewines.com",
        },
      },
    });

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
const updateIsBanned = async (id, banned) => {
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
const updateIsSommelier = async (id, sommelier) => {
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

// Makes user admin or not
const updateIsAdmin = async (id, admin) => {
  try {
    const userFound = await getUserById(id);

    if (!userFound.length) {
      return [];
    }

    const updatedUser = await User.update(
      {
        isAdmin: admin,
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

// Verifies user account or not
const updateIsVerified = async (id, verified) => {
  try {
    const userFound = await getUserById(id);

    if (!userFound.length) {
      return [];
    }

    const updatedUser = await User.update(
      {
        isVerified: verified,
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

// Updates password
const updatePassword = async (id, password) => {
  try {
    const userUpdated = await User.update(
      {
        password: await bcrypt.hash(password, 10),
      },
      {
        where: {
          id,
        },
      }
    );

    if (userUpdated[0] === 1) {
      const userFound = await getUserById(id);

      return userFound;
    }
  } catch (error) {
    throw new Error("Error trying to update password!");
  }
};

// Get sommeliers
const getSommeliers = async (id) => {
  const results = [];

  try {
    const dbResults = await User.findAll({
      where: {
        id: {
          [Op.not]: id,
        },
        isSommelier: true,
      },
    });

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
    throw new Error("Error trying to get all sommeliers from DB!");
  }
};

// Get total users by region
const getTotalUsersByRegion = async (users) => {
  let regions = {};

  for (let x = 0; x < users.length; x++) {
    if (regions.hasOwnProperty(users[x].region)) {
      regions[users[x].region] = regions[users[x].region] + 1;
    } else {
      regions[users[x].region] = 1;
    }
  }

  return regions;
};

// Get banned users
const getBannedUsers = async () => {
  const results = [];

  try {
    const dbResults = await User.findAll({
      where: {
        isBanned: true,
        email: {
          [Op.not]: "admin@ewines.com",
        },
      },
    });

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

// Get not banned users
const getNotBannedUsers = async () => {
  const results = [];

  try {
    const dbResults = await User.findAll({
      where: {
        isBanned: false,
        email: {
          [Op.not]: "admin@ewines.com",
        },
      },
    });

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

// Delete user by id
const deleteUserById = async (id) => {
  try {
    const userFound = await getUserById(id);

    if (!userFound.length) {
      return [];
    }

    const deletedUser = await User.destroy({
      where: {
        id,
      },
    });

    if (deletedUser === 1) {
      return userFound;
    }
  } catch (error) {
    throw new Error("Error trying to delete a user!");
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateIsBanned,
  updateIsSommelier,
  updateIsAdmin,
  updateIsVerified,
  updatePassword,
  getSommeliers,
  getTotalUsersByRegion,
  getBannedUsers,
  getNotBannedUsers,
  deleteUserById,
};
