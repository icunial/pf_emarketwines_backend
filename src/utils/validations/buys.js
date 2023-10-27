// Validates currency
const validateCurrency = (currency) => {
  if (!currency) return "Currency parameter is missing";
  if (typeof currency !== "string") return "Currency must be a string";
  if (currency !== "ARG" && currency !== "USD") return "Currency not available";
  return false;
};
