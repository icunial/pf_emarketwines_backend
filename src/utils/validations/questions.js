// Validates text
const validateText = (text) => {
  if (!text) return "Text parameter is missing";
  if (typeof text !== "string") return "Text must be a string";
  return false;
};

// Validates answer
const validateAnswer = (answer) => {
  if (!answer) return "Answer parameter is missing";
  if (typeof answer !== "string") return "Answer must be a string";
  return false;
};

module.exports = {
  validateText,
  validateAnswer,
};
