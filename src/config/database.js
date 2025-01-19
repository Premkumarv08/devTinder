const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://premkumarv08:ke7va8v19E6lBFSA@namastenode.yrusv.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
