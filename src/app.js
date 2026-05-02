const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Bank Homepage");
});

module.exports = app;
