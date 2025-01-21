const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authenticateUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if(!token) {
      throw new Error("Unauthorized request");
    }
    const { userId } = jwt.verify(token, "PREMKUMAR@123");
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
};

module.exports = { authenticateUser };
