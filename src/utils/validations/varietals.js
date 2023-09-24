// Validates Name
const validateName = (name) => {
  if (!name) return "Name parameter is missing";
  if (typeof name !== "string") return "Name must be a string";
  return false;
};

// Validates Description
const validateDescription = (description) => {
  if (!description) return "Description parameter is missing";
  if (typeof description !== "string") return "Description must be a string";
  return false;
};

module.exports = {
  validateName,
  validateDescription,
};
