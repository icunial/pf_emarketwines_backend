// Validates status
const validateStatus = (status) => {
  if (!status) return "Status parameter is missing";
  if (typeof status !== "string") "Status must be a string";
  if (
    status.toUpperCase() !== "PENDING" &&
    status.toUpperCase() !== "IN TRANSIT" &&
    status.toUpperCase() !== "ARRIVED"
  ) {
    return "Status not available";
  }
  return false;
};

module.exports = {
  validateStatus,
};
