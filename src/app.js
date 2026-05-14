const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectToDB = require("../src/config/db");
const authRoutes = require("../src/routes/authRoutes");
const accountRoutes = require("../src/routes/accountRoutes");
const transactionRoutes = require("../src/routes/transactionRoutes");

const app = express();
connectToDB();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/account", accountRoutes);
app.use("/api/transaction", transactionRoutes);

app.get("/", (req, res) => {
  res.send("Bank Homepage");
});

// For Render
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

module.exports = app;
