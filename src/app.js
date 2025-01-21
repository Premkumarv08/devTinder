const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSingupData } = require("./utils/validations");
const { authenticateUser } = require("./middlewares/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    validateSingupData(req);
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    //Creating a new instance of the user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("User added successfully!");
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid credentials!");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials!");
    }
    const token = jwt.sign({ userId: user._id }, "PREMKUMAR@123", {expiresIn: '1d'});
    res.cookie("token", token, { httpOnly: true, expires: new Date(Date.now() + 24 * 60 * 60 * 1000) });
    res.send(user);
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

app.get("/profile", authenticateUser, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

app.post('/sendconnectionrequest', authenticateUser, async (req, res) => {
  try {
    const user = req.user;
    res.send(user.firstName + ' sent a connection request!');
  } catch (error) {
    res.status(400).send('Error : ' + error.message);
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
