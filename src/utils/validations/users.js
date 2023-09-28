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

// Validates email
const validateEmail = (email) => {
  if (!email) return "Email parameter is missing";
  if (typeof email !== "string") return "Email must be a string";
  return false;
};

// Validates region
const validateRegion = (region) => {
  if (!region) return "Region parameter is missing";
  if (typeof region !== "string") return "Region must be a string";
  return false;
};

// Validates phone
const validatePhone = (phone) => {
  if (typeof phone !== "string") return "Phone must be a string";
  return false;
};

module.exports = {
  validateUsername,
  validatePassword,
  validateEmail,
  validateRegion,
  validatePhone,
};
