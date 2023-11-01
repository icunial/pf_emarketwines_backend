// Validates text
const validateText = (text) => {
  if (!text) return "Text parameter is missing";
  if (typeof text !== "string") return "Text must be a string";
  return false;
};
