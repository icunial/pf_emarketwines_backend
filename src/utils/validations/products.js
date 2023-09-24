// Validates name
const validateName = (name) => {
  if (!name) return "Name parameter is missing";
  if (typeof name !== "string") return "Name must be a string";
  return false;
};

// Validates type
const validateType = (type) => {
  if (!type) return "Type parameter is missing";
  if (typeof type !== "string") return "Type must be a string";
  return false;
};

// Validates varietal
const validateVarietal = (varietal) => {
  if (!varietal) return "Varietal parameter is missing";
  if (typeof varietal !== "string") return "Varietal must be a string";
  return false;
};

// Validates origin
const validateOrigin = (origin) => {
  if (!origin) return "Origin parameter is missing";
  if (typeof origin !== "string") return "Origin must be a string";
  return false;
};

module.exports = {
  validateName,
  validateType,
  validateVarietal,
  validateOrigin,
};
