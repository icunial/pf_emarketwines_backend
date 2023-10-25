const express = require("express");
const router = express.Router();

const User = require("../models/User");

const bcrypt = require("bcryptjs");

const validations = require("../utils/validations/users");

const passport = require("passport");

const {
  getUsers,
  getUserById,
  updateIsBanned,
  updateIsAdmin,
  updateIsSommelier,
  updateIsVerified,
  updatePassword,
  getSommeliers,
  getTotalUsersByRegion,
  getBannedUsers,
  getNotBannedUsers,
  deleteUserById,
} = require("../controllers/users");

const {
  validateId,
  ensureAuthenticated,
} = require("../utils/validations/index");

// Get all users
router.get("/", async (req, res, next) => {
  try {
    const users = await getUsers();

    if (!users.length) {
      return res.status(404).json({
        statusCode: 404,
        msg: `No users saved in DB!`,
      });
    }

    res.status(200).json({
      statusCode: 200,
      data: users,
    });
  } catch (error) {
    return next(error);
  }
});

// Logout Process
router.get("/logout", (req, res, next) => {
  if (!req.user) {
    return res.status(400).json({
      statusCode: 400,
      msg: `No user logged in`,
    });
  }
  req.logout((err) => {
    if (err) return next(err);
    res.status(200).send(true);
  });
});

// Get Logged in user
router.get("/user", (req, res) => {
  if (req.user) {
    return res.status(200).json({
      statusCode: 200,
      data: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        image: req.user.image,
        region: req.user.region,
        phone: req.user.phone,
        buyLevel: req.user.buyLevel,
        balance: req.user.balance,
        isSommelier: req.user.isSommelier,
        isBanned: req.user.isBanned,
        isVerified: req.user.isVerified,
      },
    });
  } else {
    return res.status(400).json({
      statusCode: 400,
      msg: `No user logged in`,
    });
  }
});

// Check if email exists
router.get("/email/:email", async (req, res, next) => {
  const { email } = req.params;

  if (validations.validateEmail(email)) {
    return res.status(400).json({
      statusCode: 400,
      msg: validations.validateEmail(email),
    });
  }

  try {
    const emailFound = await User.findOne({
      where: {
        email,
      },
    });

    if (emailFound) {
      return res.status(200).json({
        statusCode: 200,
        msg: "Email address is not available",
      });
    }

    return res.status(404).json({
      statusCode: 404,
      msg: "Email address is available",
    });
  } catch (error) {
    return next("Error trying get a email address");
  }
});

// Check if username exists
router.get("/username/:username", async (req, res, next) => {
  const { username } = req.params;

  if (validations.validateUsername(username)) {
    return res.status(400).json({
      statusCode: 400,
      msg: validations.validateUsername(username),
    });
  }

  try {
    const usernameFound = await User.findOne({
      where: {
        username,
      },
    });

    if (usernameFound) {
      return res.status(200).json({
        statusCode: 200,
        msg: "Username is not available",
      });
    }

    return res.status(404).json({
      statusCode: 404,
      msg: "Username is available",
    });
  } catch (error) {
    return next("Error trying get a username");
  }
});

// Get all sommeliers
router.get("/sommeliers", ensureAuthenticated, async (req, res, next) => {
  try {
    const sommeliers = await getSommeliers(req.user.dataValues.id);

    if (!sommeliers.length) {
      return res.status(404).json({
        statusCode: 404,
        msg: "No sommeliers saved in DB!",
      });
    }

    res.status(200).json({
      statusCode: 200,
      data: sommeliers,
    });
  } catch (error) {
    return next(error);
  }
});

// Get total users by region
router.get("/regions", ensureAuthenticated, async (req, res, next) => {
  if (
    req.user.dataValues.email !== "admin@ewines.com" &&
    req.user.dataValues.isAdmin === false
  ) {
    return res.status(401).json({
      statusCode: 401,
      msg: "You are not authorized! You must have admin privileges...",
    });
  }

  try {
    const users = await getUsers();

    if (!users.length) {
      return res.status(404).json({
        statusCode: 404,
        msg: `No users saved in DB!`,
      });
    }

    const totalUsersByRegion = await getTotalUsersByRegion(users);

    res.status(200).json({
      statusCode: 200,
      data: totalUsersByRegion,
    });
  } catch (error) {
    return next(error);
  }
});

// Get banned users
router.get("/banned/true", ensureAuthenticated, async (req, res, next) => {
  if (
    req.user.dataValues.email !== "admin@ewines.com" &&
    req.user.dataValues.isAdmin === false
  ) {
    return res.status(401).json({
      statusCode: 401,
      msg: "You are not authorized! You must have admin privileges...",
    });
  }

  try {
    const users = await getBannedUsers();

    if (!users.length) {
      return res.status(404).json({
        statusCode: 404,
        msg: `No banned users saved in DB!`,
      });
    }

    res.status(200).json({
      statusCode: 200,
      data: users,
    });
  } catch (error) {
    return next(error);
  }
});

// Get not banned users
router.get("/banned/false", ensureAuthenticated, async (req, res, next) => {
  if (
    req.user.dataValues.email !== "admin@ewines.com" &&
    req.user.dataValues.isAdmin === false
  ) {
    return res.status(401).json({
      statusCode: 401,
      msg: "You are not authorized! You must have admin privileges...",
    });
  }

  try {
    const users = await getNotBannedUsers();

    if (!users.length) {
      return res.status(404).json({
        statusCode: 404,
        msg: `No not banned users saved in DB!`,
      });
    }

    res.status(200).json({
      statusCode: 200,
      data: users,
    });
  } catch (error) {
    return next(error);
  }
});

// Get user by ID
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  if (!validateId(id)) {
    return res.status(400).json({
      statusCode: 400,
      msg: `ID ${id} - Invalid format!`,
    });
  }

  try {
    const user = await getUserById(id);

    if (!user.length) {
      return res.status(404).json({
        statusCode: 404,
        msg: `User with ID: ${id} not found!`,
      });
    }

    res.status(200).json({
      statusCode: 200,
      data: user,
    });
  } catch (error) {
    return next(error);
  }
});

// Create new user
router.post("/register", async (req, res, next) => {
  const { password, password2, email, username, region, phone } = req.body;

  // Validations
  if (validations.validatePassword(password)) {
    return res.status(400).json({
      statusCode: 400,
      msg: validations.validatePassword(password),
    });
  }

  if (validations.validateEmail(email)) {
    return res.status(400).json({
      statusCode: 400,
      msg: validations.validateEmail(email),
    });
  }

  if (validations.validateUsername(username)) {
    return res.status(400).json({
      statusCode: 400,
      msg: validations.validateUsername(username),
    });
  }

  if (validations.validateRegion(region)) {
    return res.status(400).json({
      statusCode: 400,
      msg: validations.validateRegion(region),
    });
  }

  if (phone && validations.validatePhone(phone)) {
    return res.status(400).json({
      statusCode: 400,
      msg: validations.validatePhone(phone),
    });
  }

  if (validations.validatePasswordConfirmation(password, password2)) {
    return res.status(400).json({
      statusCode: 400,
      msg: validations.validatePasswordConfirmation(password, password2),
    });
  }

  try {
    const emailExist = await User.findOne({
      where: {
        email,
      },
    });

    if (emailExist) {
      return res.status(400).json({
        statusCode: 400,
        msg: `Email ${email} exists! Try with another one!`,
      });
    }

    const usernameExist = await User.findOne({
      where: {
        username,
      },
    });

    if (usernameExist) {
      return res.status(400).json({
        statusCode: 400,
        msg: `Username ${username} exists! Try with another one!`,
      });
    }

    // Hash Password
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) {
          return next("Error trying to register a new user");
        }
        try {
          const userCreated = await User.create({
            username,
            password: hash,
            email,
            region,
            phone,
          });
          if (userCreated) {
            return res.status(201).json({
              statusCode: 201,
              data: userCreated,
            });
          }
        } catch (error) {
          return next("Error trying to register a new user");
        }
      });
    });
  } catch (error) {
    console.log(error.message);
    return next("Error trying to register a new user");
  }
});

// Login Process
router.post("/login", async (req, res, next) => {
  if (req.user) {
    return res.status(400).json({
      statusCode: 400,
      msg: `A user is already logged in`,
    });
  }

  const { email, password } = req.body;

  if (validations.validateEmail(email)) {
    return res.status(400).json({
      statusCode: 400,
      msg: validations.validateEmail(email),
    });
  }

  if (validations.validatePassword(password)) {
    return res.status(400).json({
      statusCode: 400,
      msg: validations.validatePassword(password),
    });
  }

  passport.authenticate("local", (error, user, info) => {
    if (error) return next(error);
    if (!user) {
      if (info.statusCode === 400) {
        return res.status(400).json({
          statusCode: info.statusCode,
          msg: info.msg,
        });
      }
      return res.status(404).json({
        statusCode: info.statusCode,
        msg: info.msg,
      });
    }
    req.logIn(user, (error) => {
      if (error) return next(error);
      return res.status(200).send(true);
    });
  })(req, res, next);
});

// Reset password
router.put("/forgot", async (req, res, next) => {
  const { email } = req.body;

  if (validations.validateEmail(email)) {
    return res.status(400).json({
      statusCode: 400,
      msg: validations.validateEmail(email),
    });
  }

  try {
    const emailExist = await User.findOne({
      where: {
        email,
      },
    });

    if (!emailExist) {
      return res.status(404).json({
        statusCode: 404,
        msg: `Email ${email} not found!`,
      });
    }

    const newPassword = "E-Wine2023";

    const userUpdated = await User.update(
      {
        password: await bcrypt.hash(newPassword, 10),
      },
      {
        where: {
          email,
        },
      }
    );

    if (userUpdated) {
      return res.status(200).json({
        statusCode: 200,
        msg: `New Password was sent to your email address!`,
      });
    }
  } catch (error) {
    return next("Error trying to reset password");
  }
});

// Update password
router.put("/password", ensureAuthenticated, async (req, res, next) => {
  const { password, password2 } = req.body;

  if (validations.validatePassword(password)) {
    return res.status(400).json({
      statusCode: 400,
      msg: validations.validatePassword(password),
    });
  }

  if (validations.validatePasswordConfirmation(password, password2)) {
    return res.status(400).json({
      statusCode: 400,
      msg: validations.validatePasswordConfirmation(password, password2),
    });
  }

  try {
    const updatedUser = await updatePassword(req.user.id, password);

    if (!updatedUser.length) {
      return res.status(404).json({
        statusCode: 404,
        msg: `User with ID: ${id} not found!`,
      });
    }

    res.status(200).json({
      statusCode: 200,
      data: updatedUser,
    });
  } catch (error) {
    console.log(error.message);
    return next("Error trying to update password");
  }
});

// Update user
router.put("/:id", ensureAuthenticated, async (req, res, next) => {
  const { id } = req.params;
  const { banned, sommelier, admin, verified } = req.query;

  let updatedUser;

  if (
    req.user.dataValues.email !== "admin@ewines.com" &&
    req.user.dataValues.isAdmin === false
  ) {
    return res.status(401).json({
      statusCode: 401,
      msg: "You are not authorized! You must have admin privileges...",
    });
  }

  try {
    if (!validateId(id)) {
      return res.status(400).json({
        statusCode: 400,
        msg: `ID invalid format!`,
      });
    }

    if (banned) {
      if (validations.validateBanned(banned)) {
        return res.status(400).json({
          statusCode: 400,
          msg: validations.validateBanned(banned),
        });
      }

      updatedUser = await updateIsBanned(id, banned);
    } else if (sommelier) {
      if (validations.validateSommelier(sommelier)) {
        return res.status(400).json({
          statusCode: 400,
          msg: validations.validateSommelier(sommelier),
        });
      }
      updatedUser = await updateIsSommelier(id, sommelier);
    } else if (admin) {
      if (validations.validateAdmin(admin)) {
        return res.status(400).json({
          statusCode: 400,
          msg: validations.validateAdmin(admin),
        });
      }
      updatedUser = await updateIsAdmin(id, admin);
    } else if (verified) {
      if (validations.validateVerified(verified)) {
        return res.status(400).json({
          statusCode: 400,
          msg: validations.validateVerified(verified),
        });
      }
      updatedUser = await updateIsVerified(id, verified);
    } else {
      return res.status(400).json({
        statusCode: 400,
        msg: `Query parameter is missing!`,
      });
    }

    if (!updatedUser.length) {
      return res.status(404).json({
        statusCode: 404,
        msg: `User with ID: ${id} not found!`,
      });
    }

    res.status(200).json({
      statusCode: 200,
      data: updatedUser,
    });
  } catch (error) {
    return next(error);
  }
});

// Delete user
router.delete("/:id", ensureAuthenticated, async (req, res, next) => {
  const { id } = req.params;

  if (
    req.user.dataValues.email !== "admin@ewines.com" &&
    req.user.dataValues.isAdmin === false
  ) {
    return res.status(401).json({
      statusCode: 401,
      msg: "You are not authorized! You must have admin privileges...",
    });
  }

  if (!validateId(id)) {
    return res.status(400).json({
      statusCode: 400,
      msg: `ID invalid format!`,
    });
  }

  try {
    const deletedUser = await deleteUserById(id);

    if (!deletedUser.length) {
      return res.status(404).json({
        statusCode: 404,
        msg: `User with ID: ${id} not found!`,
      });
    }

    res.status(200).json({
      statusCode: 200,
      data: deletedUser,
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
