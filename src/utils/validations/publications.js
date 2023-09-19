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

// Validate amount
const validateAmount = (amount) => {
  if (amount === 0 || amount < 0) return "Amount must higher than 0";
  if (!amount) return "Amount parameter is missing";
  if (typeof amount !== "number") return "Amount must be a number";
  return false;
};

module.exports = {
  validateTitle,
  validatePrice,
  validateAmount,
};
