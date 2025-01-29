const validator = require("validator");

const validateSingupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName) throw new Error("First name is required");
  if (!validator.isEmail(emailId)) throw new Error("Email ID is not valid");
  if (!validator.isStrongPassword(password))
    throw new Error("Please enter a strong password!");
};

const validateEditData = (req) => {
  const allowedFields = [
    "firstName",
    "lastName",
    "about",
    "skills",
    "photoUrl",
    "age",
    "gender",
  ];

  return Object.keys(req.body).every((key) => allowedFields.includes(key));
};

module.exports = { validateSingupData, validateEditData };
