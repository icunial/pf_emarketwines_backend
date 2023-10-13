const express = require("express");
const router = express.Router();

const User = require("../models/User");

const bcrypt = require("bcryptjs");

const validations = require("../utils/validations/users");

const {
  getUsers,
  getUserById,
  updateIsBanned,
  updateIsAdmin,
  updateIsSommelier,
  updateIsVerified,
} = require("../controllers/users");

const { validateId } = require("../utils/validations/index");

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

  if (validations.validateEmail(email.toLowerCase())) {
    return res.status(400).json({
      statusCode: 400,
      msg: validations.validateEmail(email.toLowerCase()),
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

// Ban or not users
router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { banned, sommelier, admin, verified } = req.query;

  let updatedUser;

  try {
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
    } else if (verified) {
      if (validations.validateVerified(verified)) {
        return res.status(400).json({
          statusCode: 400,
          msg: validations.validateVerified(verified),
        });
      }
    } else {
      return res.status(400).json({
        statusCode: 400,
        msg: `Query parameter is missing!`,
      });
    }

    if (!validateId(id)) {
      return res.status(400).json({
        statusCode: 400,
        msg: `ID invalid format!`,
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

module.exports = router;
