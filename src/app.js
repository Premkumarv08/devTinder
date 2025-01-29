const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestsRouter = require("./routes/requests");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestsRouter);

connectDB()
  .then(() => {
    console.log("Database connection established");
    app.listen("3001", () => {
      console.log("Server is successfully listening to 3001");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!", err);
  });
