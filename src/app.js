const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectToDB = require("../src/config/db");
const authRoutes = require("../src/routes/authRoutes");

const app = express();
connectToDB();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Bank Homepage");
});

module.exports = app;
