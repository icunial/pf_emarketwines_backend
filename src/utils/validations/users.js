// Validates username
const validateUsername = (username) => {
  if (!username) return "Username parameter is missing";
  if (typeof username !== "string") return "Username must be a string";
  return false;
};

// Validates password
const validatePassword = (password) => {
  if (!password) return "Password parameter is missing";
  if (typeof password !== "string") return "Password must be a string";
  if (password.length < 8) return "Password must be at least 8 character long";

  return false;
};

// Validates email
const validateEmail = (email) => {
  if (!email) return "Email parameter is missing";
  if (typeof email !== "string") return "Email must be a string";
  return false;
};

// Validates region
const validateRegion = (region) => {
  if (!region) return "Region parameter is missing";
  if (typeof region !== "string") return "Region must be a string";
  return false;
};

// Validates phone
const validatePhone = (phone) => {
  if (typeof phone !== "string") return "Phone must be a string";
  return false;
};

const minChars = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

const mayChars = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

const nums = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

const symbols = [
  "!",
  "@",
  "#",
  "$",
  "%",
  "^",
  "&",
  "*",
  "(",
  ")",
  "-",
  "_",
  "<",
  ">",
  ".",
  ",",
  "?",
  "/",
  "\\",
  "|",
  "=",
  "+",
  "-",
];

module.exports = {
  validateUsername,
  validatePassword,
  validateEmail,
  validateRegion,
  validatePhone,
};
