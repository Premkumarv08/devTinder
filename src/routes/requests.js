const express = require("express");
const { authenticateUser } = require("../middlewares/auth");
const requestsRouter = express.Router();

requestsRouter.post(
  "/sendconnectionrequest",
  authenticateUser,
  async (req, res) => {
    try {
      const user = req.user;
      res.send(user.firstName + " sent a connection request!");
    } catch (error) {
      res.status(400).send("Error : " + error.message);
    }
  }
);

module.exports = requestsRouter;
