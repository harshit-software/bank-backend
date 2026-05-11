const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { createAccount } = require("../controllers/accountController");

router.post("/", protect, createAccount);

module.exports = router;
