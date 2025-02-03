const express = require("express");
const { authenticateUser } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

// Get all the pending connection requests for the logged in user
userRouter.get("/user/requests", authenticateUser, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const requests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName"]);
    res.send(requests);
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

userRouter.get("/user/connections", authenticateUser, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const requests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = requests.map((request) => {
      if (request.fromUserId._id.equals(loggedInUser._id)) {
        return request.toUserId;
      } else {
        return request.fromUserId;
      }
    });
    res.send(data);
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

userRouter.get("/user/feed", authenticateUser, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) > 50 ? 50 : parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const requests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id },
      ],
    }).select("fromUserId toUserId");
    const hideUsersFromFeed = new Set();

    requests.forEach((request) => {
      hideUsersFromFeed.add(request.fromUserId);
      hideUsersFromFeed.add(request.toUserId);
    })
    const users = await User.find({ _id: { $nin: Array.from(hideUsersFromFeed) } }).select(USER_SAFE_DATA).skip(skip).limit(limit);

    res.json({data: users});
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

module.exports = userRouter;
