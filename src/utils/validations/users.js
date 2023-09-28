// Validates username
const validateUsername = (username) => {
  if (!username) return "Username parameter is missing";
  if (typeof username !== "string") return "Username must be a string";
  return false;
};

// Validates password
const validatePassword = (password) => {
  if (!password) return "Password parameter is missing";
  if (typeof password !== "string") return "Password must be a string";
  return false;
};

module.exports = {
  validateUsername,
  validatePassword,
};
