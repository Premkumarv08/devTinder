const express = require("express");
const { authenticateUser } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const requestsRouter = express.Router();

requestsRouter.post(
  "/request/send/:status/:toUserId",
  authenticateUser,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      if(!allowedStatus.includes(status)) {
        throw new Error("Invalid status!");
      }

      const user = await User.findById(toUserId);
      if(!user) {
        throw new Error("User not found!");
      }

      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId},
          { fromUserId: toUserId, toUserId: fromUserId},
        ],
      })

      if(existingRequest) {
        throw new Error("Request already exists!");
      }
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({
        message: user.firstName + " is " + status + " by you!",
        data,
      })
    } catch (error) {
      res.status(400).send("Error : " + error.message);
    }
  }
);

module.exports = requestsRouter;
