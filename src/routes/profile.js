const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { authenticateUser } = require("../middlewares/auth");
const { validateEditData } = require("../utils/validations");
const profileRouter = express.Router();

profileRouter.get("/profile/view", authenticateUser, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

profileRouter.patch("/profile/edit", authenticateUser, async (req, res) => {
  try {
    if (!validateEditData(req)) {
      throw new Error("Invalid data");
    }
    const user = req.user;
    Object.keys(req.body).forEach((key) => {
      user[key] = req.body[key];
    });
    await user.save();
    res.json({
      message: `${user.firstName}, your profile has been updated successfully!`,
      data: user,
    });
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

profileRouter.patch(
  "/profile/change-password",
  authenticateUser,
  async (req, res) => {
    try {
      const { user } = req;
      const { currentPassword, newPassword, emailId } = req.body;
      if (emailId !== user.emailId) {
        throw new Error("Invalid Crendentials!");
      }
      const isPasswordValid = await user.validatePassword(currentPassword);
      if (!isPasswordValid) {
        throw new Error("Invalid Crendentials!");
      }
      if (!validator.isStrongPassword(newPassword))
          throw new Error("Please enter a strong password!");
      const passwordHash = await bcrypt.hash(newPassword, 10);
      user.password = passwordHash;
      await user.save();
      res.json({
        message: `${user.firstName}, your password has been updated successfully!`,
        data: user,
      });
    } catch (error) {
      res.status(400).send("Error : " + error.message);
    }
  }
);

module.exports = profileRouter;
