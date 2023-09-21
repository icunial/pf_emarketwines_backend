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
  if (!banned) return "Banned query is missing";
  if (banned !== "true" && banned !== "false")
    return "Banned must be a true or false";
  return false;
};

// Regular expression to check if string is a valid UUID
const regexExp =
  /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;

// Validate id
const validateId = (id) => {
  return regexExp.test(id);
};

module.exports = {
  validateTitle,
  validatePrice,
  validateAmount,
  validateDescription,
  validateBanned,
  validateId,
};
