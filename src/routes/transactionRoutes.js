const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { initiateFunds } = require("../middlewares/transactionMiddleware");
const {
  createTransaction,
  addInitialFunds,
} = require("../controllers/transactionController");

router.post("/", protect, createTransaction);
router.post("/initiate-funds", initiateFunds, addInitialFunds);
module.exports = router;
