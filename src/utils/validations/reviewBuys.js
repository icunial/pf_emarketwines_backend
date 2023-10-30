// Validates stars
const validateStars = (stars) => {
  if (!validateStars) return "Stars parameter is missing";
  if (typeof validateStars !== "number") return "Stars must be a number";
  if (stars < 0 && stars > 5) return "Stars must be between 0 and 5";
  return false;
};

// Validates text
const validateText = (text) => {
  if (!text) return "Text paratemer is missing";
  if (typeof text !== "string") return "Text must be a string";
  return false;
};

module.exports = {
  validateStars,
  validateText,
};
