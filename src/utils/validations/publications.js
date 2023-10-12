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

// Validate description
const validateDescription = (description) => {
  if (!description) return "Description parameter is missing";
  if (typeof description !== "string") return "Description must be a string";
  return false;
};

// Validate banned
const validateBanned = (banned) => {
  if (!banned) return "Banned parameter is missing";
  if (banned !== "true" && banned !== "false")
    return "Banned must be a true or false";
  return false;
};

module.exports = {
  validateTitle,
  validatePrice,
  validateAmount,
  validateDescription,
  validateBanned,
};
