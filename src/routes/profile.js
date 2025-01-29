const express = require("express");
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

module.exports = profileRouter;
