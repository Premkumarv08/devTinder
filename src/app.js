const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  //Creating a new instance of the user model
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User added successfully!");
  } catch (error) {
    res.status(400).send("Error saving the user:" + error.message);
  }
});

app.get("/user", async (req, res) => {
  const emailId = req.body.emailId;
  try {
    const users = await User.find({ emailId });
    if (users.length === 0) {
      res.status(404).send("User not found!");
    } else {
      res.send(users);
    }
  } catch (error) {
    res.status(400).send("Error while fetching the user:" + error.message);
  }
});

app.get('/feed', async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      res.status(404).send("User not found!");
    } else {
      res.send(users);
    }
  } catch (error) {
    res.status(400).send("Error while fetching the user:" + error.message);
  }
})

app.delete('/user', async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId)
    res.send("User deleted successfully!")
  } catch (error) {
    res.status(400).send("Error while deleting the user:" + error.message);
  }
})

app.patch('/user', async (req, res) => {
  const {userId, ...data} = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId, data, {returnDocument: "after"})
    res.send(user)
  } catch (error) {
    res.status(400).send("Error while updating the user:" + error.message);
  }
})

connectDB()
  .then(() => {
    console.log("Database connection established");
    app.listen("3000", () => {
      console.log("Server is successfully listening to 3000");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!", err);
  });
