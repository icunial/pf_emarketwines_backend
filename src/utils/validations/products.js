// Validates name
const validateName = (name) => {
  if (!name) return "Name parameter is missing";
  if (typeof name !== "string") return "Name must be a string";
  return false;
};

// Validate type
const validateType = (type) => {
  if (!type) return "Type parameter is missing";
  if (typeof type !== "string") return "Type must be a string";
  return false;
};

module.exports = {
  validateName,
  validateType,
};
