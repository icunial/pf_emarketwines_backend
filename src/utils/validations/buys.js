// Validates currency
const validateCurrency = (currency) => {
  if (!currency) return "Currency parameter is missing";
  if (typeof currency !== "string") return "Currency must be a string";
  if (currency !== "ARG" && currency !== "USD") return "Currency not available";
  return false;
};

// Validates paymentMethod
const validatesPaymentMethod = (paymentMethod) => {
  if (!paymentMethod) return "Payment Method parameter is missing";
  if (typeof paymentMethod !== "string")
    return "Payment Method must be a string";
  if (paymentMethod !== "CASH" && paymentMethod !== "CARD")
    return "Payment Method not available";
  return false;
};
