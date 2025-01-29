const express = require("express");
const { authenticateUser } = require("../middlewares/auth");
const profileRouter = express.Router();

profileRouter.get("/profile", authenticateUser, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

module.exports = profileRouter;
