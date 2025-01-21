const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSingupData } = require("./utils/validations");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    validateSingupData(req);
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    console.log("password", passwordHash);
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
    res.status(400).send("Error saving the user:" + error.message);
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
    const token = jwt.sign({ userId: user._id }, "PREMKUMAR@123");
    res.cookie("token", token, { httpOnly: true });
    res.send(user);
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

app.get("/profile", async (req, res) => {
  const token = req.cookies?.token;
  if (!token) {
    res.status(401).send("Unauthorized request");
  } else {
    try {
      const { userId } = jwt.verify(token, "PREMKUMAR@123");
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found!");
      }
      res.send(user);
    } catch (error) {
      res.status(400).send("Error : " + error.message);
    }
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

app.get("/feed", async (req, res) => {
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
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully!");
  } catch (error) {
    res.status(400).send("Error while deleting the user:" + error.message);
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed!");
    }
    if (data?.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }
    const user = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send(user);
  } catch (error) {
    res.status(400).send("Error while updating the user :" + error.message);
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
