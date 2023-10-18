const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const bcrypt = require("bcryptjs");

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          // Match email
          const userFound = await User.findOne({
            where: {
              email,
            },
          });
          if (userFound) {
            // Match password
            bcrypt.compare(password, userFound.password, (err, isMatch) => {
              if (err) {
                return done(err, null);
              }
              if (isMatch) {
                return done(null, userFound);
              } else {
                return done(null, false, {
                  statusCode: 400,
                  msg: `Incorrect password!`,
                });
              }
            });
          } else {
            return done(null, false, {
              statusCode: 404,
              msg: `Email address not found!`,
            });
          }
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const userFound = await User.findByPk(id);
      if (userFound) {
        done(null, userFound);
      } else {
        done(null, { msg: `User not found!` });
      }
    } catch (error) {
      done(error, null);
    }
  });
};
