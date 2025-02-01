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

      const toUser = await User.findById(toUserId);
      if(!toUser) {
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
        message: toUser.firstName + " is " + status + " by you!",
        data,
      })
    } catch (error) {
      res.status(400).send("Error : " + error.message);
    }
  }
);

requestsRouter.post(
  "/request/review/:status/:requestId",
  authenticateUser,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];

      if(!allowedStatus.includes(status)) { 
        throw new Error("Invalid status!");
      }

      const connectionRequest = await ConnectionRequest.findOne({_id: requestId, toUserId: loggedInUser._id, status: "interested"});
      if(!connectionRequest) {
        res.status(404).send("Request not found!");
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({
        message: "Your request has been reviewed!",
        data,
      })
    } catch (error) {
      res.status(400).send("Error : " + error.message);
    }
  }
);

module.exports = requestsRouter;
