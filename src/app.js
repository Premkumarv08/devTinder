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
