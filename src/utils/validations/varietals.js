// Validates Name
const validateName = (name) => {
  if (typeof name !== "string") return "Name must be a string";
  return false;
};

// Validates Description
const validateDescription = (description) => {
  if (typeof description !== "string") return "Description must be a string";
  return false;
};

module.exports = {
  validateName,
  validateDescription,
};
