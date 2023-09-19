// Validates title
const validateTitle = (title) => {
  if (!title) return "Title parameter is missing";
  if (typeof title !== "string") return "Title must be a string";
  return false;
};

// Validates price
const validatePrice = (price) => {
  if (!price) return "Price parameter is missing";
  if (typeof price !== "number") return "Price must be a number";
  return false;
};

module.exports = {
  validateTitle,
  validatePrice,
};
