// Regular expression to check if string is a valid UUID
const regexExp =
  /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;

// Validate id
const validateId = (id) => {
  return regexExp.test(id);
};

// Access Control
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    return res.status(401).json({
      statusCode: 401,
      msg: `You are not authorized! Please login...`,
    });
  }
};

module.exports = {
  validateId,
  ensureAuthenticated,
};
