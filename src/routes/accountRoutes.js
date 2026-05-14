const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  createAccount,
  getAccountBalance,
} = require("../controllers/accountController");

router.post("/", protect, createAccount);
router.get("/", protect, getAccountBalance);
module.exports = router;
