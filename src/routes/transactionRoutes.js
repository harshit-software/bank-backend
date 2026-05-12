const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { createTransaction } = require("../controllers/transactionController");

router.post("/", protect, createTransaction);

module.exports = router;
