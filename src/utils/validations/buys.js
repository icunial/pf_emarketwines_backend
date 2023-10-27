// Validates currency
const validateCurrency = (currency) => {
  if (!currency) return "Currency parameter is missing";
  if (typeof currency !== "string") return "Currency must be a string";
  if (currency.toUpperCase() !== "ARG" && currency.toUpperCase() !== "USD")
    return "Currency not available";
  return false;
};

// Validates paymentMethod
const validatePaymentMethod = (paymentMethod) => {
  if (!paymentMethod) return "Payment Method parameter is missing";
  if (typeof paymentMethod !== "string")
    return "Payment Method must be a string";
  if (
    paymentMethod.toUpperCase() !== "CASH" &&
    paymentMethod.toUpperCase() !== "CARD"
  )
    return "Payment Method not available";
  return false;
};

// Validates total amount
const validateTotalAmount = (totalAmount) => {
  if (totalAmount === 0 || totalAmount < 0)
    return "Total Amount must be higher than 0";
  if (!totalAmount) return "Total Amount parameter is missing";
  if (typeof totalAmount !== "number") return "Total Amount must be a number";
  return false;
};

module.exports = {
  validateCurrency,
  validatePaymentMethod,
  validateTotalAmount,
};
