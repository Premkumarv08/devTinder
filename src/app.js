const express = require("express");

const app = express();

app.get("/user", (req, res) => {
    res.send({"firstname": "prem", "lastname": "kumar"})
})

app.post("/user", (req, res) => {
    res.send("Data added to database successfully")
})

app.delete("/user", (req, res) => {
    res.send("Data removed from database successfully")
})

app.use("/test", (req, res) => {
  res.send("Hello from test");
});

app.use("/", (req, res) => {
  res.send("Hello from dashboard");
});

app.listen(3000, () => {
  console.log("Server started");
});
