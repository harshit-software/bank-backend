const Account = require("../models/Account");
const createAccount = async (req, res) => {
  try {
    const user = req.user;
    const isAccount = await Account.findOne({ user: user._id });
    if (isAccount) {
      return res
        .status(401)
        .json({ success: false, message: "Account Already Exists", isAccount });
    }
    const account = await Account.create({ user: user._id });
    res.status(201).json({
      success: true,
      message: "Account Created Successfully",
      account,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getAccountBalance = async (req, res) => {
  const account = await Account.findOne({ user: req.user });
  const balance = await account.getBalance();
  res.status(200).json({
    success: true,
    message: "Account Balance Retrieved Successfully",
    balance,
  });
};
module.exports = { createAccount, getAccountBalance };
