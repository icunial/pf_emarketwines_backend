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
  if (!hasCapitalLetter(password))
    return "Password must have one capital letter";
  if (!hasNumber(password)) return "Password must have one number";
  if (!hasSymbol(password)) return "Password must have one symbol";
  return false;
};

// Validates password confirmation
const validatePasswordConfirmation = (password, password2) => {
  if (!password2) return "Password Confirmation parameter is missing";
  if (typeof password2 !== "string")
    return "Password Confirmation must be a string";
  if (password2.length < 8)
    return "Password Confirmation must be at least 8 character long";
  if (!hasCapitalLetter(password2))
    return "Password Confirmation must have one capital letter";
  if (!hasNumber(password2))
    return "Password Confirmation must have one number";
  if (!hasSymbol(password2))
    return "Password Confirmation must have one symbol";
  if (password !== password2)
    return "Password and Password Confirmation not match";

  return false;
};

// Validates email
const validateEmail = (email) => {
  if (!email) return "Email parameter is missing";
  if (typeof email !== "string") return "Email must be a string";
  if (email.split("@").length !== 2) return "Email format is not valid!";
  if (email.split("@")[1].split(".").length < 2)
    return "Email format is not valid!";

  for (s of email.split("@")[1].split(".")) {
    if (hasSymbol(s)) return "Email format not valid";
    if (hasNumber(s)) return "Email format not valid";
  }

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
  if (hasSymbol(phone) || hasCapitalLetter(phone) || hasSmallLetter(phone))
    return "Phone must contain only numbers";

  return false;
};

const hasCapitalLetter = (password) => {
  const passwordToArray = Array.from(password);

  for (c of passwordToArray) {
    if (capitalLetters.includes(c)) {
      return true;
    }
  }

  return false;
};

const hasSmallLetter = (password) => {
  const passwordToArray = Array.from(password);

  for (c of passwordToArray) {
    if (smallLetters.includes(c)) {
      return true;
    }
  }

  return false;
};

const hasNumber = (password) => {
  const passwordToArray = Array.from(password);

  for (c of passwordToArray) {
    if (nums.includes(c)) {
      return true;
    }
  }

  return false;
};

const hasSymbol = (password) => {
  const passwordToArray = Array.from(password);

  for (c of passwordToArray) {
    if (symbols.includes(c)) {
      return true;
    }
  }

  return false;
};

const smallLetters = [
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

const capitalLetters = [
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

// Validate banned
const validateBanned = (banned) => {
  if (!banned) return "Banned query is missing";
  if (banned !== "true" && banned !== "false")
    return "Banned must be a true or false";
  return false;
};

module.exports = {
  validateUsername,
  validatePassword,
  validatePasswordConfirmation,
  validateEmail,
  validateRegion,
  validatePhone,
  validateBanned,
};
