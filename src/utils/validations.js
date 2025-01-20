const validator = require("validator");

const validateSingupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName) throw new Error("First name is required");
  if (!validator.isEmail(emailId)) throw new Error("Email ID is not valid");
  if (!validator.isStrongPassword(password))
    throw new Error("Please enter a strong password!");
};

module.exports = { validateSingupData }